<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class GameType extends Model
{
    use HasTranslations;
    use HasFactory;

    protected $fillable = [
        'name',
        'slug'
    ];

    public $translatable = [
        'name',
        'slug'
    ];

    /*
    |--------------------------------------------------------------------------
    | FUNCTIONS
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function games(): hasMany
    {
        return $this->hasMany(Game::class);
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    /*
   |--------------------------------------------------------------------------
   | ACCESSORS
   |--------------------------------------------------------------------------
   */
}
