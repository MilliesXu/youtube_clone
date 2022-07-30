import { useForm } from "@mantine/hooks"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../api"
import { AxiosError } from "axios"
import { showNotification, updateNotification } from "@mantine/notifications"
import Head from "next/head"
import { Button, Container, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core"
import { useRouter } from "next/router"

const LoginPage = () => {
  const router = useRouter()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    }
  })

  const mutation = useMutation<{}, AxiosError<{errorMessage: string}>, Parameters<typeof loginUser>['0']>(loginUser, {
    onSuccess: () => {
      router.push('/')
    },
    onError: (error) => {
      showNotification({
        id: 'login',
        title: 'Error',
        message: error.response?.data.errorMessage,
        loading: false
      })
    }
  })

  
  return <>
  <Head>
    <title>Login</title>
  </Head>
  <Container>
    <Title>
      Login
    </Title>

    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <Stack>
          <TextInput label="Email" placeholder="jane@example.com" required {...form.getInputProps('email')}/>
          <PasswordInput label="Password" placeholder="Your Strong Password" required {...form.getInputProps('password')}/>
          <Button type="submit">Login</Button>
        </Stack>
      </form>
    </Paper>
  </Container>
</>
}

export default LoginPage
