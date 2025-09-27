import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, GalleryVerticalEnd } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        R&R.
                    </a>
                </div>
                
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Head title="Log in" />
                        
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold">Inicie sesión en su cuenta</h1>
                            <p className="text-muted-foreground mt-2">
                                Ingrese su correo electrónico y contraseña a continuación para iniciar sesión
                            </p>
                        </div>

                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Usuario</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="Cristhian.infante@rr.com.pe"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Contraseña</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-sm"
                                                    >
                                                      ¿Olvidaste tu Contraseña?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Contraseña"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                            />
                                            <Label htmlFor="remember">Recuérdame</Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-4 w-full"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            )}
                                            Iniciar Sesión
                                        </Button>
                                    </div>

                                    {/* <div className="text-center text-sm text-muted-foreground">
                                        Don't have an account?{' '}
                                        <TextLink href={register()}>
                                            Sign up
                                        </TextLink>
                                    </div> */}
                                </>
                            )}
                        </Form>

                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="https://img.freepik.com/foto-gratis/interior-gran-almacen-distribucion-estantes-apilados-paletas-productos-listos-mercado_342744-1481.jpg"
                    alt="Login"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    );
}