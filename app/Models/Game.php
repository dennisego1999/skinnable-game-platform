<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Builder;

class Game extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'game_type_id',
        'is_active',
        'background_color',
        'accent_color',
    ];

    public $translatable = [
        'name',
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
    public function type(): belongsTo
    {
        return $this->belongsTo(GameType::class, 'game_type_id');
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /*
   |--------------------------------------------------------------------------
   | ACCESSORS
   |--------------------------------------------------------------------------
   */
}
