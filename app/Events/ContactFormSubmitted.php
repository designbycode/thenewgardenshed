<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;

class ContactFormSubmitted
{
    use Dispatchable;

    /**
     * @param  array<string, string>  $data
     */
    public function __construct(
        public readonly array $data,
    ) {}
}
