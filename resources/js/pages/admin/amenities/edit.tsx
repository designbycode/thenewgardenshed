import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';

export default function AdminAmenitiesEdit({
    amenity,
}: {
    amenity: {
        id: number;
        slug: string;
        name: string;
        description: string | null;
        icon: string;
        display_order: number;
    };
}) {
    const { data, setData, put, processing, errors } = useForm({
        slug: amenity.slug,
        name: amenity.name,
        description: amenity.description ?? '',
        icon: amenity.icon,
        display_order: String(amenity.display_order),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/amenities/${amenity.slug}`);
    }

    return (
        <>
            <Head title={`Edit ${amenity.name}`} />

            <div className="flex flex-col gap-6 p-4 pt-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/amenities">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title={amenity.name}
                        description="Edit amenity details"
                    />
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-8">
                    <div className="grid gap-6 rounded-xl border p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    required
                                />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="icon">Icon (Emoji or class)</Label>
                                <Input
                                    id="icon"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    required
                                />
                                <InputError message={errors.icon} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', e.target.value)}
                                    required
                                />
                                <InputError message={errors.display_order} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save Changes</Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/amenities">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminAmenitiesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Amenities', href: '/admin/amenities' },
        { title: 'Edit' },
    ],
};
