<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, User $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('manage-users');
    }

    public function update(User $user, User $model): bool
    {
        return $user->can('manage-users');
    }

    public function delete(User $user, User $model): bool
    {
        //Prevent deleting yourself
        if ($user->is($model)) {
            return false;
        }

        return $user->can('manage-users');
    }
}
