<?php

namespace App\Policies;

use App\Models\Game;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class GamePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Game $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('manage-games');
    }

    public function update(User $user, Game $model): bool
    {
        return $user->can('manage-games');
    }

    public function delete(User $user, Game $model): bool
    {
        return $user->can('manage-games');
    }
}
