import { GripVertical, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface PendingFile {
    id: string;
    file: File;
    preview: string;
}

export type MediaItem = {
    id: number;
    url: string;
    thumb: string;
    preview: string;
    name: string;
    order: number;
    size: number;
};

interface ImageUploadAreaProps {
    onUpload: (files: File[]) => void;
    disabled?: boolean;
    media?: MediaItem[];
    roomSlug?: string;
}

function SortableImage({
    item,
    index,
    onDelete,
}: {
    item: MediaItem;
    index: number;
    onDelete: (id: number) => void;
}) {
    const { ref, isDragging, isDropTarget } = useSortable({
        id: String(item.id),
        index,
        group: 'room-images',
    });

    return (
        <div
            ref={ref}
            className={`group relative overflow-hidden rounded-lg border transition-opacity ${isDragging ? 'z-10 opacity-50' : ''} ${isDropTarget ? 'ring-2 ring-primary' : ''}`}
        >
            <img
                src={item.preview}
                alt={item.name}
                className="aspect-video w-full object-cover"
            />
            <div className="absolute top-1 right-1 flex size-6 items-center justify-center rounded bg-black/60 text-xs font-medium text-white">
                {item.order}
            </div>
            <button
                type="button"
                className="absolute top-1 left-1 flex size-6 cursor-grab items-center justify-center rounded bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            >
                <GripVertical className="size-4" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
            <div className="truncate px-2 py-1 text-xs text-muted-foreground">
                {item.name}
            </div>
        </div>
    );
}

export function ImageUploadArea({ onUpload, disabled, media, roomSlug }: ImageUploadAreaProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [localMedia, setLocalMedia] = useState<MediaItem[]>(media ?? []);
    const dragCounter = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const wasDisabled = useRef(disabled);

    useEffect(() => {
        if (media) {
            setLocalMedia(media);
        }
    }, [media]);

    useEffect(() => {
        if (wasDisabled.current && !disabled) {
            pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
            setPendingFiles([]);
        }
        wasDisabled.current = disabled;
    }, [disabled]);

    const addFiles = useCallback(
        (files: File[]) => {
            const newFiles = files.map((f) => ({
                id: crypto.randomUUID(),
                file: f,
                preview: URL.createObjectURL(f),
            }));
            setPendingFiles((prev) => [...prev, ...newFiles]);
            onUpload(files);
        },
        [onUpload],
    );

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
                addFiles(files);
            }
            e.target.value = '';
        },
        [addFiles],
    );

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            dragCounter.current = 0;
            const files = Array.from(e.dataTransfer.files).filter((f) =>
                ACCEPTED_TYPES.includes(f.type),
            );
            if (files.length > 0) {
                addFiles(files);
            }
        },
        [addFiles],
    );

    function handleReorder(event: any) {
        const source = event.operation?.source;
        if (!source) return;

        const fromIdx = source.initialIndex;
        const toIdx = source.index;
        if (typeof fromIdx !== 'number' || typeof toIdx !== 'number') return;
        if (fromIdx === toIdx) return;

        const items = [...localMedia];
        if (fromIdx < 0 || fromIdx >= items.length || toIdx < 0 || toIdx >= items.length) return;

        const [moved] = items.splice(fromIdx, 1);
        items.splice(toIdx, 0, moved);
        const updated = items.map((m, i) => ({ ...m, order: i + 1 }));
        setLocalMedia(updated);
        toast.success('Images reordered.');

        router.put(
            `/admin/rooms/${roomSlug}/images/reorder`,
            { media_ids: updated.map((m) => m.id) },
            { preserveScroll: true, preserveUrl: true },
        );
    }

    function handleDelete(mediaId: number) {
        if (!confirm('Delete this image?')) return;

        if (roomSlug) {
            router.delete(`/admin/rooms/${roomSlug}/images/${mediaId}`, {
                preserveScroll: true,
                preserveUrl: true,
            });
        }
    }

    const borderClass = isDragging
        ? 'border-[#c5a059] bg-[#c5a059]/5'
        : 'border-gray-300 dark:border-gray-700';

    return (
        <div className="space-y-4">
            <div
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${borderClass}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                </p>
                <p className="text-xs text-gray-400">
                    JPEG, PNG, WebP up to 10MB
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    disabled={disabled}
                    onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                    }}
                >
                    {disabled ? 'Uploading...' : 'Select Images'}
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(',')}
                    multiple
                    className="hidden"
                    onChange={handleInput}
                    disabled={disabled}
                />
            </div>

            {pendingFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {pendingFiles.map((file) => (
                        <div
                            key={file.id}
                            className="overflow-hidden rounded-lg border"
                        >
                            <div className="relative">
                                <img
                                    src={file.preview}
                                    alt={file.file.name}
                                    className="aspect-video w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <svg
                                        className="size-8 animate-spin text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="truncate px-2 py-1 text-xs text-muted-foreground">
                                {file.file.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {localMedia.length > 0 && (
                <DragDropProvider onDragEnd={handleReorder}>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {localMedia.map((item, idx) => (
                            <SortableImage
                                key={item.id}
                                item={item}
                                index={idx}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </DragDropProvider>
            )}
        </div>
    );
}
