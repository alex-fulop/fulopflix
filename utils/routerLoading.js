export function handleRouterLoading(setIsLoading, router) {
    const handleComplete = () => setIsLoading(false);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
        router.events.off('routeChangeComplete', handleComplete)
        router.events.off('routeChangeError', handleComplete);
    }
}