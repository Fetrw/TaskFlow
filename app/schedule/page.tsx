"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navbar";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority: "low" | "medium" | "high";
  description?: string;
};

const CustomToolbar = ({ onNavigate, onView, view, date }: any) => {
  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToCurrent = () => {
    onNavigate("TODAY");
  };

  const label = useMemo(() => {
    return format(date, "MMMM yyyy");
  }, [date]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={goToBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToCurrent}>
          Today
        </Button>
      </div>
      <h2 className="text-lg font-semibold font-display">{label}</h2>
      <div className="flex gap-2">
        <Button
          variant={view === Views.MONTH ? "secondary" : "ghost"}
          onClick={() => onView(Views.MONTH)}
        >
          Month
        </Button>
        <Button
          variant={view === Views.WEEK ? "secondary" : "ghost"}
          onClick={() => onView(Views.WEEK)}
        >
          Week
        </Button>
        <Button
          variant={view === Views.DAY ? "secondary" : "ghost"}
          onClick={() => onView(Views.DAY)}
        >
          Day
        </Button>
      </div>
    </div>
  );
};

export default function SchedulePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState(Views.WEEK);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    priority: "medium",
    start: new Date(),
    end: new Date(),
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("taskflow-schedule");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("taskflow-schedule", JSON.stringify(events));
    }
  }, [events]);

  // Update current time indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot(start);
    setNewEvent({
      title: "",
      description: "",
      priority: "medium",
      start,
      end,
    });
  };

  const handleSelectEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const addEvent = () => {
    if (!newEvent.title?.trim()) return;

    const event: Event = {
      id: `event-${Date.now()}`,
      title: newEvent.title!,
      start: newEvent.start!,
      end: newEvent.end!,
      priority: newEvent.priority as "low" | "medium" | "high",
      description: newEvent.description,
    };

    setEvents([...events, event]);
    setNewEvent({
      title: "",
      description: "",
      priority: "medium",
      start: new Date(),
      end: new Date(),
    });
    setSelectedSlot(null);
  };

  const updateEvent = () => {
    if (!editingEvent) return;

    const updatedEvents = events.map((event) =>
      event.id === editingEvent.id ? editingEvent : event
    );
    setEvents(updatedEvents);
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setEditingEvent(null);
  };

  const eventStyleGetter = (event: Event) => {
    const style: React.CSSProperties = {
      backgroundColor:
        event.priority === "high"
          ? "rgb(239 68 68)"
          : event.priority === "medium"
          ? "rgb(59 130 246)"
          : "rgb(156 163 175)",
      color: "white",
    };
    return { style };
  };

  const TimeGutter = ({ date }: { date?: Date }) => {
    if (!date) return null;

    const isCurrentHour =
      date.getHours() === currentTime.getHours() &&
      date.getDate() === currentTime.getDate() &&
      date.getMonth() === currentTime.getMonth() &&
      date.getFullYear() === currentTime.getFullYear();

    return (
      <div
        className={`relative ${isCurrentHour ? "font-bold text-primary" : ""}`}
      >
        {format(date, "HH:mm")}
        {isCurrentHour && (
          <div className="absolute right-0 w-full h-0.5 bg-primary animate-pulse" />
        )}
      </div>
    );
  };

  const slotPropGetter = (date: Date) => {
    const isSelected =
      selectedSlot &&
      date.getHours() === selectedSlot.getHours() &&
      date.getDate() === selectedSlot.getDate() &&
      date.getMonth() === selectedSlot.getMonth();

    return {
      className: isSelected ? "selected-slot" : "",
    };
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary font-display">
            Schedule
          </h1>
        </div>

        <div className="bg-card rounded-lg shadow-lg">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 16rem)" }}
            view={view}
            onView={(v: any) => setView(v)}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            slotPropGetter={slotPropGetter}
            components={{
              timeGutterHeader: () => (
                <div className="text-muted-foreground font-display">Time</div>
              ),
              timeGutterWrapper: TimeGutter,
              toolbar: CustomToolbar,
            }}
            timeslots={2}
            step={30}
          />
        </div>

        {/* Add Event Dialog */}
        <Dialog
          open={selectedSlot !== null}
          onOpenChange={() => setSelectedSlot(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
              <Select
                value={newEvent.priority}
                onValueChange={(value) =>
                  setNewEvent({
                    ...newEvent,
                    priority: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogClose asChild>
              <Button onClick={addEvent}>Add Event</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog
          open={!!editingEvent}
          onOpenChange={() => setEditingEvent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            {editingEvent && (
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Event title"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Description"
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                />
                <Select
                  value={editingEvent.priority}
                  onValueChange={(value) =>
                    setEditingEvent({
                      ...editingEvent,
                      priority: value as "low" | "medium" | "high",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={() => deleteEvent(editingEvent.id)}
                  >
                    Delete
                  </Button>
                  <Button onClick={updateEvent}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
