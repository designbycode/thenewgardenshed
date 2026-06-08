<?php

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class);

test('homepage is accessible', function () {
    $this->get('/')
        ->assertOk();
});
