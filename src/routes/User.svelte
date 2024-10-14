<script>
    export let currentParams;

    let user = {
        username: '',
        email: '',
    };

    let loading = true;
    let errorMessage = '';

    const fetchUserData = async () => {
        if (currentParams.id) {
            try {
                const response = await fetch(`http://localhost:3000/auth/profile/${currentParams.id}`, {
                headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                user = await response.json();
            } catch (error) {
                console.error("Error fetching user data:", error);
            }finally {
                loading = false;
            }
        } else {
            loading = false;
            errorMessage = "User ID is missing.";
        }
    };

    fetchUserData();
</script>

<div class="bg-gray-800 p-6 rounded-lg shadow-md text-white">
    <h2 class="text-2xl font-bold mb-4">User Information</h2>
    {#if loading}
        <p>Loading user data...</p>
    {:else if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {:else if user.username}
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
    {:else}
        <p>No user data found.</p>
    {/if}
</div>