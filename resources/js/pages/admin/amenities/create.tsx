import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';

export default function AdminAmenitiesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        slug: '',
        name: '',
        description: '',
        icon: '',
        display_order: '0',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/amenities');
    }

    return (
        <>
            <Head title="Create Amenity" />

            <div className="flex flex-col gap-6 p-4 pt-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/amenities">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="Create Amenity"
                        description="Add a new amenity for rooms"
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
                        <Button disabled={processing}>Create Amenity</Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/amenities">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminAmenitiesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Amenities', href: '/admin/amenities' },
        { title: 'Create' },
    ],
};
