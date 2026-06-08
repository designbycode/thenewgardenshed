import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';

export default function AdminRoomsCreate({
    amenities,
}: {
    amenities: { id: number; name: string; icon: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        slug: '',
        name: '',
        type: 'standard' as string,
        description: '',
        short_description: '',
        blockquote: '',
        price_per_night: '',
        capacity: '2',
        bed_type: '',
        bathroom_type: '',
        amenity_ids: [] as number[],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/rooms');
    }

    function toggleAmenity(id: number) {
        setData(
            'amenity_ids',
            data.amenity_ids.includes(id)
                ? data.amenity_ids.filter((a) => a !== id)
                : [...data.amenity_ids, id],
        );
    }

    return (
        <>
            <Head title="Create Room" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Heading
                        title="Create Room"
                        description="Add a new room to your inventory"
                    />
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="grid gap-6 rounded-xl border p-6">
                        <h2 className="text-lg font-semibold">Details</h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData('slug', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                >
                                    <option value="luxury">Luxury</option>
                                    <option value="standard">Standard</option>
                                    <option value="cozy">Cozy</option>
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price_per_night">
                                    Price per Night ($)
                                </Label>
                                <Input
                                    id="price_per_night"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price_per_night}
                                    onChange={(e) =>
                                        setData(
                                            'price_per_night',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <InputError message={errors.price_per_night} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <select
                                    id="capacity"
                                    value={data.capacity}
                                    onChange={(e) =>
                                        setData('capacity', e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                    required
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option
                                            key={i + 1}
                                            value={String(i + 1)}
                                        >
                                            {i + 1}{' '}
                                            {i === 0 ? 'Guest' : 'Guests'}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.capacity} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bed_type">Bed Type</Label>
                                <select
                                    id="bed_type"
                                    value={data.bed_type}
                                    onChange={(e) =>
                                        setData('bed_type', e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                    required
                                >
                                    <option value="">Select bed type</option>
                                    <option value="King">King</option>
                                    <option value="Queen">Queen</option>
                                    <option value="Double">Double</option>
                                    <option value="Twin">Twin</option>
                                    <option value="Triple">Triple</option>
                                    <option value="Bunk Bed">Bunk Bed</option>
                                </select>
                                <InputError message={errors.bed_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bathroom_type">
                                    Bathroom Type
                                </Label>
                                <select
                                    id="bathroom_type"
                                    value={data.bathroom_type}
                                    onChange={(e) =>
                                        setData('bathroom_type', e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                    required
                                >
                                    <option value="">
                                        Select bathroom type
                                    </option>
                                    <option value="Private">Private</option>
                                    <option value="Shared">Shared</option>
                                    <option value="Ensuite">Ensuite</option>
                                </select>
                                <InputError message={errors.bathroom_type} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="short_description">
                                Short Description
                            </Label>
                            <Input
                                id="short_description"
                                value={data.short_description}
                                onChange={(e) =>
                                    setData('short_description', e.target.value)
                                }
                                maxLength={255}
                                required
                            />
                            <InputError message={errors.short_description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={6}
                                required
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="blockquote">Blockquote</Label>
                            <Textarea
                                id="blockquote"
                                value={data.blockquote}
                                onChange={(e) =>
                                    setData('blockquote', e.target.value)
                                }
                                rows={3}
                            />
                            <InputError message={errors.blockquote} />
                        </div>
                    </div>

                    {amenities.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Amenities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                    {amenities.map((amenity) => (
                                        <label
                                            key={amenity.id}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-muted/50"
                                        >
                                            <Checkbox
                                                checked={data.amenity_ids.includes(
                                                    amenity.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleAmenity(amenity.id)
                                                }
                                            />
                                            <span className="text-sm">
                                                {amenity.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Room</Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/rooms">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminRoomsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Rooms', href: '/admin/rooms' },
        { title: 'Create' },
    ],
};
