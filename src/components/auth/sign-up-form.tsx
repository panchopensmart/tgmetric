'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

import {createUserWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../../conf/firebase';
// import {app} from '../../conf/dbFirebase';
// import { getFirestore, doc, setDoc , collection} from 'firebase/firestore';
// import { useList  } from "react-firebase-hooks/database";
// import { ref, getDatabase , push, set } from 'firebase/database';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email обязательное поле' }).email(),
  password: zod.string().min(1, { message: 'Пароль обязательное поле' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: ''} satisfies Values;
// const database = getDatabase(app);

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const [errorsSignUp, setErrorsSignUp] = React.useState<string>('');

  // const [snapshots, loading, error] = useList(ref(database, 'list'));

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  // const [snapshots, loading, error] = useList(collection(db, 'list'))

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const { email, password} = values;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // const newRef = push(ref(database, 'list')); // Создаем новый ключ
        // await set(newRef, {
        //   email,
        //   chanelLink
        // });
        setIsPending(false);
        window.location.href = '/auth/sign-in';
      } catch (error) {
        console.error("Ошибка регистрации:", error);
        setIsPending(false);
      }

      setIsPending(false);
      // console.log(values);
      // const { error } = await authClient.signUp(values);
      //
      // if (error) {
      //   setError('root', { type: 'server', message: error });
      //   setIsPending(false);
      //   return;
      // }
      //
      // // Refresh the auth state
      // await checkSession?.();
      //
      // // UserProvider, for this case, will not refresh the router
      // // After refresh, GuestGuard will handle the redirect
      // router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Регистрация</Typography>
        <Typography color="text.secondary" variant="body2">
          Уже есть аккаунт?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Вход
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/*<Controller*/}
          {/*  control={control}*/}
          {/*  name="chanelLink"*/}
          {/*  render={({ field }) => (*/}
          {/*    <FormControl>*/}
          {/*      <InputLabel>Ссылка на канал</InputLabel>*/}
          {/*      <OutlinedInput {...field} label="Ссылка на канал" />*/}
          {/*    </FormControl>*/}
          {/*  )}*/}
          {/*/>*/}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...field} label="Email" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Пароль</InputLabel>
                <OutlinedInput {...field} label="Пароль" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {/*<Controller*/}
          {/*  control={control}*/}
          {/*  name="terms"*/}
          {/*  render={({ field }) => (*/}
          {/*    <div>*/}
          {/*      <FormControlLabel*/}
          {/*        control={<Checkbox {...field} />}*/}
          {/*        label={*/}
          {/*          <React.Fragment>*/}
          {/*            I have read the <Link>terms and conditions</Link>*/}
          {/*          </React.Fragment>*/}
          {/*        }*/}
          {/*      />*/}
          {/*      {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*/>*/}
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Зарегистрироваться
          </Button>
        </Stack>
      </form>
      <Alert color="warning">Из-за большого количества заявок срок интеграции может достигать до 2х дней</Alert>
    </Stack>
  );
}
