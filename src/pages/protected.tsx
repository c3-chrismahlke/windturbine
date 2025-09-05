import { useSession, signIn, signOut } from "next-auth/react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Typography sx={{ p: 2 }}>Loading…</Typography>;

  if (!session) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" gutterBottom>Protected</Typography>
        <Typography component="p" sx={{ mb: 2 }}>You must be signed in to view this page.</Typography>
        <Button variant="contained" onClick={() => signIn("github")}>Sign in with GitHub</Button>
      </Box>
    );
  }

  const roles = (session.user as any)?.roles as string[] | undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Typography component="h1" variant="h5" gutterBottom>Welcome, {session.user?.name || session.user?.email}</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }} aria-label="Your roles">
        {(roles ?? []).map((r) => (
          <Chip key={r} label={r} size="small" />
        ))}
      </Stack>
      <Button variant="outlined" onClick={() => signOut()}>Sign out</Button>
    </Box>
  );
}
