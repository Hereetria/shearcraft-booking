"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatDateShort,
  getRelativeDateDescription,
} from "@/lib/reservation-utils";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= today) {
      onDateChange(newDate);
    }
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date >= today) {
        onDateChange(date);
        setIsOpen(false);
      }
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPastDate = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="space-y-4">
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousDay}
            className="h-8 w-8 p-0"
            aria-label="Previous day"
            disabled={isToday}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className={cn(
              "px-3",
              isToday && "bg-blue-50 border-blue-200 text-blue-700"
            )}
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextDay}
            className="h-8 w-8 p-0"
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getRelativeDateDescription(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              classNames={{
                day_disabled:
                  "text-gray-400 bg-gray-100 opacity-50 cursor-not-allowed hover:bg-gray-100 hover:text-gray-400 line-through",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Date Display */}
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900">
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="text-sm text-gray-600">{formatDateShort(selectedDate)}</div>
      </div>
    </div>
  );
}
