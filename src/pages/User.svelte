<script>
    import { userStore } from "../stores/userStores";
    import { tokenStore } from "../stores/authStore";
    import { onDestroy } from "svelte";
    import { get } from 'svelte/store';

    let user = {
        id: null,
        username: '',
        email: '',
        isAdmin: false,
    };

    let token = get(tokenStore);
    let loading = true;
    let errorMessage = '';
    let isEditing = false;
    let editUsername = '';
    let editEmail = '';

    const unsubscribeToken = tokenStore.subscribe(value => {
        token = value;
    });


    
    const saveUserDetails = async () => {
    try {
        const response = await fetch(`http://localhost:3000/users/me/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                username: editUsername,
                email: editEmail,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to update user details.');
        }

        const data = await response.json();
        const updatedUser = data.user;

        user.username = updatedUser.username;
        user.email = updatedUser.email;
        isEditing = false;
    } catch (error) {
        console.error("Error updating user details:", error);
        errorMessage = error.message;
    }
};


    
    const startEditing = () => {
        isEditing = true;
        editUsername = user.username;
        editEmail = user.email;
    };

    const cancelEditing = () => {
        isEditing = false;
    };


    const fetchUserData = async () => {

        if(!token){
            loading = false;
            errorMessage = "No token available.";
            return;
        }

        if (!user.id) {
            loading = false;
            return;
        }

            try {
                const response = await fetch(`http://localhost:3000/users/me/${user.id}`, {
                method: 'GET',    
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

                

                if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Network response was not ok');
            }

            const data = await response.json();
            user.username = data.username;
            user.email = data.email;
            if (data.status === 'success' && data.user) {
                user = data.user;
            } else {
                errorMessage = 'No user data found.';
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            errorMessage = error.message;
        } finally {
            loading = false;
        }
    }

    const unsubscribe = userStore.subscribe(value => {
      user = { ...value};
      if (user.id) {
            fetchUserData();
        }
    });

    onDestroy(() => {
    unsubscribe();
    unsubscribeToken();
});
</script>

<div class="bg-gray-800 p-6 rounded-lg shadow-md text-white">
    <h2 class="text-2xl font-bold mb-4">User Information</h2>
    {#if loading}
        <p>Loading user data...</p>
    {:else if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {:else if user.username}

    {#if isEditing}
            <div class="mb-4">
                <label class="block mb-2">Username:</label>
                <input
                    type="text"
                    bind:value={editUsername}
                    class="p-2 rounded bg-gray-700 text-white w-full"
                />
                <label class="block mb-2">Email:</label>
                <input
                    type="email"
                    bind:value={editEmail}
                    class="p-2 rounded bg-gray-700 text-white w-full"
                />
                <div class="flex space-x-2 mt-4">
                    <button
                        on:click={saveUserDetails}
                        class="bg-green-500 text-white p-2 rounded"
                    >
                        Save
                    </button>
                    <button
                        on:click={cancelEditing}
                        class="bg-red-500 text-white p-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {:else}
        
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {#if user.isAdmin} <p><strong>Admin</strong></p>
        {:else} <p><strong>not Admin</strong></p>
        {/if}

        <button
                on:click={startEditing}
                class="bg-blue-500 text-white p-2 rounded mt-4"
            >
                Edit user details
            </button>
        {/if}
    {:else}
        <p>No user data found.</p>
    {/if}
</div>