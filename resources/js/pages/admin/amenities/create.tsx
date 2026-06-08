import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';

export default function CreateAmenity() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        icon: '',
        display_order: 0,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/amenities');
    }

    return (
        <>
            <Head title="Create Amenity" />

            <div className="flex flex-col gap-6 p-4 pt-0">
                <Heading
                    title="Create Amenity"
                    description="Add a new room amenity"
                />

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => {
                                    setData((d) => ({
                                        ...d,
                                        name: e.target.value,
                                        slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                                    }));
                                }}
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                required
                            />
                            {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon (Lucide name)</Label>
                            <Input
                                id="icon"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                            />
                            {errors.icon && <p className="text-sm text-destructive">{errors.icon}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="display_order">Display Order</Label>
                            <Input
                                id="display_order"
                                type="number"
                                value={data.display_order}
                                onChange={(e) => setData('display_order', parseInt(e.target.value))}
                            />
                            {errors.display_order && <p className="text-sm text-destructive">{errors.display_order}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            Create Amenity
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/amenities">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateAmenity.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Amenities', href: '/admin/amenities' },
        { title: 'Create' },
    ],
};
