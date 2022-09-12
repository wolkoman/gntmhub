export const useUser = (options?: {require: 'logged out' | 'logged in'}) => {
    const $localStorage = process.client ? localStorage : { getItem: () => undefined, setItem: () => { } };
    const user = useState<{ loggedIn: false } | { token: string, username: string, loggedIn: true }>('user');
    onMounted(() => {
        user.value = JSON.parse($localStorage.getItem('user') ?? '{"loggedIn": false}');
    });
    watch(user, (user) => {
        if (user)
            $localStorage.setItem('user', JSON.stringify(toRaw(user)));
    });
    return user;

}