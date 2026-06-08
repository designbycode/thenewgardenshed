<?php

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class);

test('facilities page is accessible', function () {
    $this->get(route('facilities.index'))
        ->assertOk();
});
