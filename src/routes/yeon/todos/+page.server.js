export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');

	  return {
			id: Date.now(),
			title,
			description,
			done: false
		};
  }
};