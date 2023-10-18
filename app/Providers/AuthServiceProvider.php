<?php

namespace App\Providers;

use App\Policies\LanguageLinePolicy;
use ArtcoreSociety\TranslationImport\Models\LanguageLine;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        LanguageLine::class => LanguageLinePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
