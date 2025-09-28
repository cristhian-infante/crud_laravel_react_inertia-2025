import AppLogoPage from './logoPrueba';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md text-foreground">                      
                <AppLogoPage />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    CRUD
                </span>
            </div>
        </>
    );
}
