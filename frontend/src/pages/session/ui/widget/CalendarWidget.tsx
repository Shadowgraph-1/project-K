import { Calendar } from "@/shared/ui/calendar"
import { useState } from "react";



function CalendarWidget() {

    const [date, setDate] = useState<Date | undefined>(new Date)

    return (
        <Calendar 
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full rounded-lg border"/>
    )
}

export default CalendarWidget;