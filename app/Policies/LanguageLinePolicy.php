<?php

namespace App\Policies;

use App\Models\User;
use ArtcoreSociety\TranslationImport\Models\LanguageLine;
use Illuminate\Auth\Access\HandlesAuthorization;

class LanguageLinePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, LanguageLine $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('manage-translations');
    }

    public function update(User $user, LanguageLine $model): bool
    {
        return $user->can('manage-translations');
    }

    public function delete(User $user, LanguageLine $model): bool
    {
        return $user->can('manage-translations');
    }
}
