import { AppShell, Header, Navbar, Box, Anchor } from "@mantine/core"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { useMe } from "../context/me"

const HomePageLayout = ({children}: {children: React.ReactNode}) => {
  const {user, refetch} = useMe()

  return (
    <AppShell
    padding="md"
    navbar={
      <Navbar width={{ base: 300 }} height={500} p="xs">
        Side Items
      </Navbar>
    }
    header={
      <Header height={60} p="xs">
        <Box sx={() => ({ display: "flex" })}>
          <Box sx={() => ({ flex: "1" })}>
            <Image src="/logo.png" alt="logo" width="100px" height="40px" />
          </Box>
          {!user && (
          <>
            <Link href='/auth/login' passHref>
              <Anchor ml="lg" mr="lr">
                Login
              </Anchor>
            </Link>
            <Link href='/auth/register' passHref>
              <Anchor ml="lg" mr="lr">
                Register
              </Anchor>
            </Link>
          </>)}

          {user && <p>Upload a video</p>}
        </Box>
      </Header>
    }
    >
      {children}
    </AppShell>
  )
}

export default HomePageLayout
