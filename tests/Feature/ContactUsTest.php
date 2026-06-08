<?php

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class);

test('contact us page is accessible', function () {
    $this->get(route('contact-us.index'))
        ->assertOk();
});

test('contact form can be submitted', function () {
    $this->post(route('contact-us.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'subject' => 'Test Subject',
        'message' => 'Test Message',
    ])->assertRedirect();
});
