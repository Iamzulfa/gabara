import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "@/Components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { formatTime } from "@/utils/formatDate";

interface CalendarEvent extends EventInput {
    extendedProps: {
        calendar: string;
    };
}

interface CalendarProps {
    events: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events: initialEvents }) => {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventTitle, setEventTitle] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventLevel, setEventLevel] = useState("");
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents || []);
    const calendarRef = useRef<FullCalendar>(null);
    const { isOpen, openModal, closeModal } = useModal();

    const calendarsEvents = {
        Danger: "danger",
        Success: "success",
        Primary: "primary",
        Warning: "warning",
    };

    useEffect(() => {
        setEvents(initialEvents || []);
    }, [initialEvents]);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        resetModalFields();
        setEventStartDate(selectInfo.startStr);
        setEventEndDate(selectInfo.endStr || selectInfo.startStr);
        openModal();
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        setSelectedEvent(event as unknown as CalendarEvent);
        setEventTitle(event.title);
        setEventStartDate(event.start?.toISOString().split("T")[0] || "");
        setEventEndDate(event.end?.toISOString().split("T")[0] || "");
        setEventLevel(event.extendedProps.calendar);
        openModal();
    };

    const handleAddOrUpdateEvent = () => {
        if (selectedEvent) {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === selectedEvent.id
                        ? {
                            ...event,
                            title: eventTitle,
                            start: eventStartDate,
                            end: eventEndDate,
                            extendedProps: { calendar: eventLevel },
                        }
                        : event
                )
            );
        } else {
            const newEvent: CalendarEvent = {
                id: Date.now().toString(),
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                allDay: true,
                extendedProps: { calendar: eventLevel },
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
        closeModal();
        resetModalFields();
    };

    const resetModalFields = () => {
        setEventTitle("");
        setEventStartDate("");
        setEventEndDate("");
        setEventLevel("");
        setSelectedEvent(null);
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="custom-calendar">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale="id"
                        headerToolbar={{
                            left: "prev,next addEventButton",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        events={events}
                        selectable={true}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        eventContent={renderEventContent}
                        customButtons={{
                            addEventButton: {
                                text: "+",
                            },
                        }}
                        buttonText={{
                            today: "Hari Ini",
                            month: "Bulan",
                            week: "Minggu",
                            day: "Hari",
                        }}
                        firstDay={1}
                        dayHeaderFormat={{ weekday: "long" }}
                        titleFormat={{ year: "numeric", month: "long" }}
                        eventTimeFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }}
                    />
                </div>
            </div>
        </>
    );
};

const renderEventContent = (eventInfo: any) => {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
    return (
        <div
            className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
        >
            <div className="fc-daygrid-event-dot"></div>
            <div className="fc-event-time">
                {eventInfo.timeText}
            </div>
            <div className="fc-event-title">{eventInfo.event.title}</div>
        </div>
    );
};

export default Calendar;
