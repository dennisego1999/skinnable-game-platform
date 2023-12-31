<?php

namespace Database\Seeders;

use App\Models\GameType;
use Illuminate\Database\Seeder;

class GameTypeSeeder extends Seeder
{
    private array $gameTypes = [
        'Earth Navigation Game',
        'Space Invader Game',
        'AR Experience Game'
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createGameTypes();
    }

    private function createGameTypes()
    {
        foreach ($this->gameTypes as $type) {
            GameType::factory()->create([
                'name' => $type,
                'slug' => $this->slugify($type)
            ]);
        }
    }

    private function slugify($text) {
        // Lowercase the string
        $text = strtolower($text);

        // Replace spaces with hyphens
        $text = str_replace(' ', '-', $text);

        // Remove special characters and non-alphanumeric characters
        $text = preg_replace('/[^a-z0-9-]/', '', $text);

        // Remove consecutive hyphens
        $text = preg_replace('/-+/', '-', $text);

        // Trim leading and trailing hyphens
        return trim($text, '-');
    }
}
