"use client";

import {
  Select,
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  TextArea,
  TextField,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api-proxy";

const Destination = () => {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;
    
    // Redirect if not admin
    if (session?.user?.email !== 'admin@wanderlust.com') {
      router.push('/');
    }
  }, [session, sessionLoading, router]);

  if (sessionLoading || session?.user?.email !== 'admin@wanderlust.com') {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Checking permissions...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Form Submitted:", data);
    
    try {
      const result = await api.destinations({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Destination added successfully:", result);
      alert("Destination added successfully!");
      e.target.reset(); // Reset form fields
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[95%] sm:max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12">
        <div className="mb-8 md:mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Destination</h1>
          <p className="text-gray-500 mt-2 text-sm">Fill in the details below to create a new travel package.</p>
        </div>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Destination Name */}
          <div className="md:col-span-2">
            <TextField name="destinationName" isRequired>
              <Label>Destination Name</Label>
              <Input placeholder="Bali Paradise" className="rounded-2xl" />
              <FieldError />
            </TextField>
          </div>

          {/* Country */}
          <TextField name="country" isRequired>
            <Label>Country</Label>
            <Input placeholder="Indonesia" className="rounded-2xl" />
            <FieldError />
          </TextField>

          {/* Category - Updated Select Component */}
          <div>
            <Select
              name="category"
              isRequired
              className="w-full"
              placeholder="Select category"
            >
              <Label>Category</Label>
              <Select.Trigger className="rounded-2xl">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="Beach" textValue="Beach">
                    Beach
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="Mountain" textValue="Mountain">
                    Mountain
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="City" textValue="City">
                    City
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="Adventure" textValue="Adventure">
                    Adventure
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="Cultural" textValue="Cultural">
                    Cultural
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="Luxury" textValue="Luxury">
                    Luxury
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Price */}
          <TextField name="price" type="number" isRequired>
            <Label>Price (USD)</Label>
            <Input type="number" placeholder="1299" className="rounded-2xl" />
            <FieldError />
          </TextField>

          {/* Duration */}
          <TextField name="duration" isRequired>
            <Label>Duration</Label>
            <Input placeholder="7 Days / 6 Nights" className="rounded-2xl" />
            <FieldError />
          </TextField>

          {/* Departure Date */}
          <div className="md:col-span-2">
            <TextField name="departureDate" type="date" isRequired>
              <Label>Departure Date</Label>
              <Input type="date" className="rounded-2xl" />
              <FieldError />
            </TextField>
          </div>

          {/* Image URL - Removed preview */}
          <div className="md:col-span-2">
            <TextField name="imageUrl" isRequired>
              <Label>Image URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/bali-paradise.jpg"
                className="rounded-2xl"
              />
              <FieldError />
            </TextField>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <TextField name="description" isRequired>
              <Label>Description</Label>
              <TextArea
                placeholder="Describe the travel experience..."
                className="rounded-3xl"
              />
              <FieldError />
            </TextField>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="solid"
            isLoading={isPending}
            className="w-full rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-6 text-lg transition-colors shadow-md shadow-cyan-500/20"
          >
            {isPending ? "Adding Package..." : "Add Travel Package"}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Destination;
