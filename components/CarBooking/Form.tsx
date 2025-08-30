import { createBooking, getStoreLocation } from "@/services";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import useModalStore from '@/store';

function Form({ car }: any) {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const { isModalOpen, toggleModal } = useModalStore();
    console.log(isModalOpen, 'yet One')
    const [storeLocation, setStoreLocation] = useState<any>([]);
    const [formValue, setFormValue] = useState({
        userName: "",
        location: "SMCentral",
        pickUpDate: "",
        dropOffDate: "",
        pickUpTime: "",
        dropOffTime: "",
        contactNumber: "",
        carId: "",
    });
    const [bookingDuration, setBookingDuration] = useState<number | "custom">(1); // Default to 1 day
    const [customDuration, setCustomDuration] = useState<number | null>(0);
    const [formChanged, setFormChanged] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getStoreLocations();
    }, []);

    useEffect(() => {
        if (car) {
            setFormValue(prev => ({ ...prev, carId: car.id }));
        }
    }, [car]);

    // No longer prefill userName; we use Clerk name as placeholder so users can edit or leave blank

    useEffect(() => {
        updateDropOffDateTime(bookingDuration);
    }, [formValue.pickUpDate, formValue.pickUpTime, bookingDuration, customDuration]);

    const getStoreLocations = async () => {
        const response: any = await getStoreLocation();
        setStoreLocation(response?.storesLocations);
    };

    const handleonChange = (event: any) => {
        const { name, value } = event.target
        setFormValue(prev => ({ ...prev, [name]: value }));
    };

    const handleDurationChange = (event: any) => {
        const selectedDuration = event.target.value;

        // If "Custom" is selected, set customDuration to 0 initially
        if (selectedDuration === "custom") {
            setCustomDuration(0);
        }

        // Check if selected duration is a number
        const isNumericDuration = !isNaN(selectedDuration) && !isNaN(parseFloat(selectedDuration));
        if (isNumericDuration) {
            setBookingDuration(parseFloat(selectedDuration));
        } else {
            setBookingDuration(selectedDuration);
        }

        updateDropOffDateTime(selectedDuration);
    };

    const handleCustomDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setCustomDuration(Number.isNaN(value) || value <= 0 ? null : value);
        updateDropOffDateTime("custom");
    };

    // Philippines mobile number utils
    const normalizePhilippineMobile = (input: string): string => {
        let value = (input || "").trim();
        // keep only digits and plus
        value = value.replace(/[^\d+]/g, "");

        if (value === "") return "+63";

        if (value.startsWith("+63")) {
            const rest = value.slice(3).replace(/\D/g, "").slice(0, 10);
            return "+63" + rest;
        }
        if (value.startsWith("63")) {
            const rest = value.slice(2).replace(/\D/g, "").slice(0, 10);
            return "+63" + rest;
        }
        if (value.startsWith("0")) {
            const rest = value.slice(1).replace(/\D/g, "").slice(0, 10);
            return "+63" + rest;
        }
        const digits = value.replace(/\D/g, "");
        if (digits.startsWith("9")) {
            return "+63" + digits.slice(0, 10);
        }
        return "+63";
    };

    const isValidPhilippineMobile = (value: string): boolean => /^(\+639)\d{9}$/.test(value);

    const handleContactNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = normalizePhilippineMobile(event.target.value);
        setFormValue(prev => ({ ...prev, contactNumber: formatted }));
    };

    const handleContactNumberFocus = () => {
        setFormValue(prev => ({ ...prev, contactNumber: prev.contactNumber || "+63" }));
    };

    const updateDropOffDateTime = (duration: number | "custom") => {
        if (!formValue.pickUpDate || !formValue.pickUpTime) return;

        const pickUpDateTime = new Date(`${formValue.pickUpDate} ${formValue.pickUpTime}`);
        const dropOffDateTime = new Date(pickUpDateTime);

        if (duration === "custom" && customDuration !== null) {
            // Calculate drop off date by adding custom duration in days
            dropOffDateTime.setDate(pickUpDateTime.getDate() + customDuration);
        } else if (typeof duration === "number") {
            // Check if duration is a number, then add the corresponding duration in days
            dropOffDateTime.setDate(pickUpDateTime.getDate() + duration);
        }

        const dropOffDate = dropOffDateTime.toISOString().split("T")[0];
        const dropOffTime = dropOffDateTime.toTimeString().split(" ")[0];

        setFormValue(prev => ({
            ...prev,
            dropOffDate,
            dropOffTime,
        }));
    };

    const validateForm = () => {
        const requiredFields = [
            // userName is optional on client; server will fallback to Clerk identity
            "pickUpDate",
            "dropOffDate",
            "pickUpTime",
            "dropOffTime",
            "contactNumber",
        ];

        for (const field of requiredFields) {
            if (formValue[field as keyof typeof formValue] === "") {
                toast.error(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
                return false;
            }
        }

        if (!isValidPhilippineMobile(formValue.contactNumber)) {
            toast.error("Enter a valid PH mobile number in +639XXXXXXXXX format.");
            return false;
        }

        return true;
    };

    useEffect(() => {
        // Compare each field in formValue with the initial state
        const isFormValueChanged =
            formValue.location !== "SMCentral" ||
            formValue.pickUpDate !== "" ||
            formValue.dropOffDate !== "" ||
            formValue.pickUpTime !== "" ||
            formValue.dropOffTime !== "" ||
            formValue.contactNumber !== "" ||
            formValue.carId !== "";

        setFormChanged(isFormValueChanged);
    }, [formValue]);

    const handleonSubmit = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to book.");
            window.location.href = "/sign-in";
            return;
        }
        // Check if any required fields are empty
        const requiredFields = ['pickUpDate', 'dropOffDate', 'pickUpTime', 'dropOffTime', 'contactNumber'];
        const anyFieldEmpty = requiredFields.some((field) => (formValue[field as keyof typeof formValue] === ""));

        if (validateForm()) {
            try {
                setIsSubmitting(true);
                const response = await createBooking(formValue);
                toast.success("Booking Created Successfully");
                // Close modal and emit booked car id for list update
                try { toggleModal(); } catch {}
                try { useModalStore.getState().setLastBookedCarId(formValue.carId); } catch {}
            } catch (e: any) {
                toast.error("Failed to create booking");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <>
            <div>
                <div className="flex flex-col w-full mb-5">
                    <label className="text-gray-800">Full Name</label>
                    <input
                        className="input input-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                        name="userName"
                        type="text"
                        placeholder={[user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Your full name'}
                        autoComplete="name"
                        aria-label="Full Name"
                        onChange={handleonChange}
                        value={formValue.userName}
                    />
                </div>
                <div className="flex flex-col w-full mb-5">
                    <label className="text-gray-800">Pick Up Location</label>
                    <select
                        className="select select-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                        value={formValue.location}
                        onChange={handleonChange}
                        name="location"
                    >
                        <option disabled>Pick Up Location?</option>
                        {storeLocation &&
                            storeLocation.map((loc: any, index: number) => (
                                <option key={index} value={loc.address}>{loc.address.replace('SM', 'SM ')}</option>
                            ))}
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-5 mb-5">
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="w-full">
                        <label className="text-gray-800">Pick Up Date</label>
                        <input
                            className="input input-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                            name="pickUpDate"
                            type="date"
                            placeholder="Click Here"
                            onChange={handleonChange}
                            min={new Date().toISOString().split('T')[0]}

                        />
                    </div>
                    <div className="w-full">
                        <label className="text-gray-800">Pick Up Time</label>
                        <input
                            className="input input-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                            name="pickUpTime"
                            type="time"
                            placeholder="Click Here"
                            onChange={handleonChange}

                        />
                    </div>
                </div>
                <div className="w-full">
                    <label className="text-gray-800 text-xl">Booking Duration(Days)</label>
                    <select
                        className="select select-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                        value={bookingDuration}
                        onChange={handleDurationChange}
                        name="bookingDuration"

                    >
                        <option value="1">1 day</option>
                        <option value="2">2 days</option>
                        {/* Updated value for "12 hrs" */}
                        {/* <option value="12hrs">12 hrs</option> */}
                        <option value="custom">Custom</option>
                    </select>
                    {bookingDuration === "custom" && (
                        <input
                            className="input input-bordered w-full max-w-lg mt-2 bg-gray-100 text-gray-800"
                            name="customDuration"
                            type="number"
                            min="1"
                            placeholder="Enter custom duration in days"
                            onChange={handleCustomDurationChange}
                        />
                    )}
                </div>
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="w-full">
                        <label className="text-gray-800">Drop Off Date</label>
                        <input
                            className="input input-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                            name="dropOffDate"
                            type="date"
                            value={formValue.dropOffDate}
                            readOnly
                            disabled
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-gray-800">Drop Off Time</label>
                        <input
                            className="input input-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                            name="dropOffTime"
                            type="time"
                            value={formValue.dropOffTime}
                            readOnly
                            disabled
                        />
                    </div>
                </div>

            </div>
            <div className="w-full">
                <label className="text-gray-800">Contact Number</label>
                <input
                    className="input input-bordered w-full max-w-lg bg-gray-100 text-gray-800"
                    name="contactNumber"
                    type="tel"
                    inputMode="tel"
                    pattern="^\\+639\\d{9}$"
                    placeholder="+639XXXXXXXXX"
                    value={formValue.contactNumber}
                    onFocus={handleContactNumberFocus}
                    onChange={handleContactNumberChange}

                />
            </div>
            <div className="modal-action">
                <button className="btn bg-zinc-500 text-white hover:bg-zinc-600 border-none" onClick={toggleModal} disabled={isSubmitting}>Close</button>
                <button
                    className={`btn border-none text-white ${isSubmitting ? 'bg-blue-300' : 'bg-blue-400 hover:bg-blue-500'}`}
                    onClick={handleonSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Booking…' : 'Schedule Book'}
                </button>
            </div>
        </>
    );
}

export default Form;





