export const getDaysBetweenDates = (start?: string, end?: string) => {
        if (!start || !end) return [];

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (endDate < startDate) return [];

        const days: string[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            days.push(
                current.toLocaleDateString("en-US", { weekday: "long" })
            );
            current.setDate(current.getDate() + 1);
        }

        return days;
    };