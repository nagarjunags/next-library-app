export const redirectTo = (url: string) => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  });
};
