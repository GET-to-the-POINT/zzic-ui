import { error } from "@sveltejs/kit";

export async function load({ parent }) {
    const { zzic } = await parent();

    const [todoStatisticsResult] = await Promise.all([
        zzic.todo.getTodoStatistics(),
    ]);

    if (todoStatisticsResult.error) error(todoStatisticsResult.error.message);

    return {
        todoStatisticsResponse: todoStatisticsResult.data
    };
}