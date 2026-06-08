<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class FacilitiesTest extends TestCase
{
    use RefreshDatabase;

    public function test_facilities_index_page_is_displayed(): void
    {
        $response = $this->get('/facilities');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('facilities/index')
        );
    }
}
