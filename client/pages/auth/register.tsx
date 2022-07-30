import { Button, Container, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/hooks"
import { showNotification, updateNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Head from "next/head"
import { useRouter } from "next/router"
import { registerUser } from "../api"

const RegisterPage = () => {
  const router = useRouter()
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    }
  })

  const mutation = useMutation<{userInfo: {
    username: String,
    email: String
  }, successMessage: String}, AxiosError<{errorMessage: string}>, Parameters<typeof registerUser>['0']>(registerUser, {
    onMutate: () => {
      showNotification({
        id: 'register',
        title: 'Creating Account',
        message: 'Please Wait',
        loading: true
      })
    },
    onSuccess: (data) => {
      updateNotification({
        id: 'register',
        title: 'Success',
        message: data.successMessage,
        loading: false
      })

      router.push('/auth/login')
    },
    onError: (error) => {
      updateNotification({
        id: 'register',
        title: 'Error',
        message: error.response?.data.errorMessage,
        loading: false
      })
    }
  })

  return <>
    <Head>
      <title>Register User</title>
    </Head>
    <Container>
      <Title>
        Register
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <TextInput label="email" placeholder="jane@example.com" required {...form.getInputProps('email')} />
            <TextInput label="username" placeholder="tomdoestech" required {...form.getInputProps('username')} />
            <PasswordInput label="password" placeholder="Your Strong Password" required {...form.getInputProps('password')} />
            <PasswordInput label="confirmPassword" placeholder="Confirm Password" required {...form.getInputProps('confirmPassword')} />
            <Button type="submit">Register</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  </>
}

export default RegisterPage