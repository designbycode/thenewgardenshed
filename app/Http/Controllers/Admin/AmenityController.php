<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAmenityRequest;
use App\Http\Requests\Admin\UpdateAmenityRequest;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AmenityController extends Controller
{
    public function index(Request $request)
    {
        $amenities = Amenity::query()
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('display_order')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/amenities/index', [
            'amenities' => $amenities,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/amenities/create');
    }

    public function store(StoreAmenityRequest $request)
    {
        $amenity = Amenity::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Amenity created successfully.']);

        return redirect()->route('admin.amenities.index');
    }

    public function edit(Amenity $amenity)
    {
        return Inertia::render('admin/amenities/edit', [
            'amenity' => $amenity,
        ]);
    }

    public function update(UpdateAmenityRequest $request, Amenity $amenity)
    {
        $amenity->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Amenity updated successfully.']);

        return redirect()->route('admin.amenities.index');
    }

    public function destroy(Amenity $amenity)
    {
        $amenity->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Amenity deleted successfully.']);

        return redirect()->route('admin.amenities.index');
    }
}
