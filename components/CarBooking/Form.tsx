import { createBooking, getStoreLocation } from "@/services";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


function Form({ car }: any) {
    const [storeLocation, setStoreLocation] = useState<any>([]);
    const [formValue, setFormValue] = useState({
        userName: "",
        location: "",
        pickUpDate: "",
        dropOffDate: "",
        pickUpTime: "",
        dropOffTime: "",
        contactNumber: "",
        carId: "",
    });
    const [bookingDuration, setBookingDuration] = useState<number | "custom">(1); // Default to 1 day
    const [customDuration, setCustomDuration] = useState<number | null>(null);

    useEffect(() => {
        getStoreLocations();
    }, []);

    useEffect(() => {
        if (car) {
            setFormValue({ ...formValue, carId: car.id });
        }
    }, [car]);

    useEffect(() => {
        updateDropOffDateTime(bookingDuration);
    }, [formValue.pickUpDate, formValue.pickUpTime, bookingDuration, customDuration]);

    const getStoreLocations = async () => {
        const response: any = await getStoreLocation();
        setStoreLocation(response?.storeLocations);
    };

    const handleonChange = (event: any) => {
        setFormValue({ ...formValue, [event.target.name]: event.target.value });
    };

    const handleDurationChange = (event: any) => {
        const selectedDuration = event.target.value;
        setBookingDuration(selectedDuration);

        // If "Custom" is selected, set customDuration to null initially
        if (selectedDuration === "custom") {
            setCustomDuration(null);
        }

        updateDropOffDateTime(selectedDuration);
    };

    const handleCustomDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setCustomDuration(Number.isNaN(value) || value <= 0 ? null : value);
        updateDropOffDateTime("custom");
    };

    // ... (existing code)

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

        setFormValue({
            ...formValue,
            dropOffDate,
            dropOffTime,
        });
    };
    // ... (remaining code)


    const handleonSubmit = async () => {
        const response = await createBooking(formValue);
        toast.success("Booking Created Successfully");
    };

    return (
        <>
            <div>
                <div className="flex flex-col w-full mb-5">
                    <label className="text-gray-800">Pick Up Location</label>
                    <select
                        className="select select-bordered w-full max-w-lg"
                        value={formValue.location}
                        onChange={handleonChange}
                        name="location"
                    >
                        <option disabled>Pick Up Location?</option>
                        {storeLocation &&
                            storeLocation.map((loc: any, index: number) => (
                                <option key={index}>{loc.address}</option>
                            ))}
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-5 mb-5">
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="w-full">
                        <label className="text-gray-800">Pick Up Date</label>
                        <input
                            className="input input-bordered w-full max-w-lg"
                            name="pickUpDate"
                            type="date"
                            placeholder="Click Here"
                            onChange={handleonChange}
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-gray-800">Pick Up Time</label>
                        <input
                            className="input input-bordered w-full max-w-lg"
                            name="pickUpTime"
                            type="time"
                            placeholder="Click Here"
                            onChange={handleonChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="w-full">
                        <label className="text-gray-800">Drop Off Date</label>
                        <input
                            className="input input-bordered w-full max-w-lg"
                            name="dropOffDate"
                            type="date"
                            value={formValue.dropOffDate}
                            readOnly
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-gray-800">Drop Off Time</label>
                        <input
                            className="input input-bordered w-full max-w-lg"
                            name="dropOffTime"
                            type="time"
                            value={formValue.dropOffTime}
                            readOnly
                        />
                    </div>
                </div>
                <div className="w-full">
                    <label className="text-gray-800 text-xl">Booking Duration(Days)</label>
                    <select
                        className="select select-bordered w-full max-w-lg"
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
                            className="input input-bordered w-full max-w-lg mt-2"
                            name="customDuration"
                            type="number"
                            min="1"
                            placeholder="Enter custom duration in days"
                            onChange={handleCustomDurationChange}
                        />
                    )}
                </div>
            </div>
            <div className="w-full">
                <label className="text-gray-800">Contact Number</label>
                <input
                    className="input input-bordered w-full max-w-lg"
                    name="contactNumber"
                    type="number"
                    placeholder="Type your contact number here"
                    onChange={handleonChange}
                />
            </div>
            <div className="modal-action">
                <button className="btn">Close</button>
                <button
                    className="btn bg-blue-400 text-white hover:bg-blue-500"
                    onClick={handleonSubmit}
                >
                    Schedule Book
                </button>
            </div>
        </>
    );
}

export default Form;





