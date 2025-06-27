export async function load({ parent, url }) {
	const { zzic } = await parent();

    const { data, error } = await zzic.category.getCategories();
    if (error) {
        console.error('카테고리 로드 실패:', error);
    }
    
    return {
        meta : {
            title: '카테고리',
            description: '카테고리 페이지입니다.'
        },
        categories: data
    };
};
