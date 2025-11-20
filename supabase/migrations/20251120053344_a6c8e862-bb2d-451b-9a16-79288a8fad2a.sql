-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'patient');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create doctors table
CREATE TABLE public.doctors (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    specialization TEXT,
    license_number TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create patients table
CREATE TABLE public.patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    date_of_birth DATE,
    gender TEXT,
    phone TEXT,
    address TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE CASCADE NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE public.doctor_patient_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE CASCADE NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('doctor', 'patient')),
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.doctor_patient_messages ENABLE ROW LEVEL SECURITY;

-- Create health_records table
CREATE TABLE public.health_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    primary_doctor_id UUID REFERENCES doctors(doctor_id),
    blood_type TEXT,
    allergies TEXT[],
    chronic_conditions TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- Create medications table
CREATE TABLE public.medications (
    medication_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_record_id UUID REFERENCES health_records(record_id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    start_date DATE,
    end_date DATE,
    prescribed_by UUID REFERENCES doctors(doctor_id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Create medical_conditions table
CREATE TABLE public.medical_conditions (
    condition_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_record_id UUID REFERENCES health_records(record_id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    diagnosed_date DATE,
    diagnosed_by UUID REFERENCES doctors(doctor_id),
    severity TEXT,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.medical_conditions ENABLE ROW LEVEL SECURITY;

-- Create test_results table
CREATE TABLE public.test_results (
    test_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_record_id UUID REFERENCES health_records(record_id) ON DELETE CASCADE NOT NULL,
    test_name TEXT NOT NULL,
    test_date DATE NOT NULL,
    results TEXT,
    comments TEXT,
    ordered_by UUID REFERENCES doctors(doctor_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for doctors
CREATE POLICY "Doctors can view their own profile"
ON public.doctors FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile"
ON public.doctors FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Patients can view doctor profiles"
ON public.doctors FOR SELECT
USING (public.has_role(auth.uid(), 'patient'));

CREATE POLICY "Admins can manage all doctors"
ON public.doctors FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for patients
CREATE POLICY "Patients can view their own profile"
ON public.patients FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Patients can update their own profile"
ON public.patients FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient profiles"
ON public.patients FOR SELECT
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Admins can manage all patients"
ON public.patients FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for appointments
CREATE POLICY "Patients can view their own appointments"
ON public.appointments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM patients p
        WHERE p.patient_id = appointments.patient_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors can view their appointments"
ON public.appointments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM doctors d
        WHERE d.doctor_id = appointments.doctor_id
        AND d.user_id = auth.uid()
    )
);

CREATE POLICY "Patients can create appointments"
ON public.appointments FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM patients p
        WHERE p.patient_id = appointments.patient_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors and patients can update appointments"
ON public.appointments FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM patients p
        WHERE p.patient_id = appointments.patient_id
        AND p.user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM doctors d
        WHERE d.doctor_id = appointments.doctor_id
        AND d.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all appointments"
ON public.appointments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for messages
CREATE POLICY "Patients can view their messages"
ON public.doctor_patient_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM patients p
        WHERE p.patient_id = doctor_patient_messages.patient_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors can view their messages"
ON public.doctor_patient_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM doctors d
        WHERE d.doctor_id = doctor_patient_messages.doctor_id
        AND d.user_id = auth.uid()
    )
);

CREATE POLICY "Patients can send messages"
ON public.doctor_patient_messages FOR INSERT
WITH CHECK (
    sender_type = 'patient' AND EXISTS (
        SELECT 1 FROM patients p
        WHERE p.patient_id = doctor_patient_messages.patient_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors can send messages"
ON public.doctor_patient_messages FOR INSERT
WITH CHECK (
    sender_type = 'doctor' AND EXISTS (
        SELECT 1 FROM doctors d
        WHERE d.doctor_id = doctor_patient_messages.doctor_id
        AND d.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all messages"
ON public.doctor_patient_messages FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for health_records
CREATE POLICY "Patients can view their health records"
ON public.health_records FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM patients p
        WHERE p.patient_id = health_records.patient_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors can view health records"
ON public.health_records FOR SELECT
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can create and update health records"
ON public.health_records FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can update health records"
ON public.health_records FOR UPDATE
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Admins can manage all health records"
ON public.health_records FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for medications
CREATE POLICY "Patients can view their medications"
ON public.medications FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM health_records hr
        JOIN patients p ON hr.patient_id = p.patient_id
        WHERE hr.record_id = medications.health_record_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors can manage medications"
ON public.medications FOR ALL
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Admins can manage all medications"
ON public.medications FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for medical_conditions
CREATE POLICY "Patients can view their conditions"
ON public.medical_conditions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM health_records hr
        JOIN patients p ON hr.patient_id = p.patient_id
        WHERE hr.record_id = medical_conditions.health_record_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors can manage conditions"
ON public.medical_conditions FOR ALL
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Admins can manage all conditions"
ON public.medical_conditions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_results
CREATE POLICY "Patients can view their test results"
ON public.test_results FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM health_records hr
        JOIN patients p ON hr.patient_id = p.patient_id
        WHERE hr.record_id = test_results.health_record_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Doctors can manage test results"
ON public.test_results FOR ALL
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Admins can manage all test results"
ON public.test_results FOR ALL
USING (public.has_role(auth.uid(), 'admin'));