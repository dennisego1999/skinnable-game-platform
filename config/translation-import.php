<?php

return [

    /**
     * The translation files that should be imported into the database.
     */

    'files' => [
        // Laravel
        'auth',
        'pagination',
        'passwords',
        'validation',
        // Add custom files here
        'global',
        'games'
    ],

    'import_json_files' => true,

    'language_line_class' => \ArtcoreSociety\TranslationImport\Models\LanguageLine::class
];
