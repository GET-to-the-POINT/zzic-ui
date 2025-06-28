export async function load({ parent }) {
  const parentData = await parent();
  return {
    ...parentData,
    layout: {
      name: 'consume',
      hasHeader: true,
      hasNavigation: false
    }
  };
}
