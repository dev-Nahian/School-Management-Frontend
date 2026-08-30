import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { admissionService } from '../services/admission.service';
import { structureService } from '../services/structure.service';
import {
  UserPlus,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Printer,
  ShieldCheck,
  GraduationCap,
  User,
  Heart,
  FileCheck,
  Lock,
  Sparkles,
} from 'lucide-react';
import type { FullAdmissionInput, AdmissionResult } from '../services/admission.service';

export const AdmissionDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form State
  const [formData, setFormData] = useState<FullAdmissionInput>({
    studentInfo: {
      firstName: '',
      lastName: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      dateOfBirth: '2012-05-10',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1 555-0199',
      email: '',
      address: '123 Academic Way',
      birthCertificateNo: 'BC-998822',
    },
    parentInfo: {
      firstName: '',
      lastName: '',
      relationship: 'FATHER',
      phone: '',
      email: '',
      occupation: 'Software Engineer',
      address: '123 Academic Way',
    },
    academicInfo: {
      academicYearId: '',
      classId: '',
      sectionId: '',
      rollNumber: '05',
    },
    documents: [
      { title: 'Student Photo', fileUrl: 'verified_photo.jpg' },
      { title: 'Birth Certificate', fileUrl: 'birth_cert.pdf' },
      { title: 'Previous School Certificate', fileUrl: 'prev_school.pdf' },
      { title: 'Parent Government ID', fileUrl: 'parent_id.pdf' },
    ],
  });

  const [documentChecklist, setDocumentChecklist] = useState({
    studentPhoto: true,
    birthCertificate: true,
    previousSchoolCert: true,
    parentId: true,
  });

  const [admissionResult, setAdmissionResult] = useState<AdmissionResult | null>(null);

  // React Queries
  const { data: stats } = useQuery({
    queryKey: ['admissionStats'],
    queryFn: admissionService.getDashboardStats,
  });

  const { data: years = [] } = useQuery({
    queryKey: ['academicYears'],
    queryFn: structureService.getAcademicYears,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: structureService.getClasses,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: structureService.getSections,
  });

  // Admission Submission Mutation
  const submitAdmissionMutation = useMutation({
    mutationFn: admissionService.submitAdmission,
    onSuccess: (data) => {
      setAdmissionResult(data);
      setCurrentStep(6); // Step 6: Confirmation
      queryClient.invalidateQueries({ queryKey: ['admissionStats'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleNext = () => {
    if (currentStep === 4) {
      // Step 4 -> Step 5 (Account Creation Preview)
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Execute Atomic Submission
      submitAdmissionMutation.mutate(formData);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 6) as any);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as any);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-indigo-900/20 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <UserPlus className="h-3.5 w-3.5" /> Phase 5 Admissions Desk
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                Admissions Management & Student Onboarding
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Process multi-step student admissions, atomic user account generation, and admission slips.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setIsWizardOpen(true);
                setCurrentStep(1);
                setAdmissionResult(null);
              }}
              className="gap-2 text-xs shadow-lg shadow-purple-600/30"
            >
              <UserPlus className="h-4 w-4" /> Start New Admission
            </Button>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
          <Card className="border-gray-800 bg-gray-900/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-medium">Total Students</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{stats?.totalStudents || 128}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-medium">Today's Admissions</span>
                <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{stats?.todayAdmissions || 3}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Calendar className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-medium">Monthly Admissions</span>
                <h3 className="text-2xl font-extrabold text-purple-300 mt-1">{stats?.monthlyAdmissions || 14}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-medium">Pending Applications</span>
                <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{stats?.pendingApplications || 2}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Admissions Roster Table */}
        <Card className="border-gray-800 print:hidden">
          <CardHeader>
            <CardTitle className="text-lg">Recent Admissions</CardTitle>
            <CardDescription className="text-xs">Latest onboarded students in current academic session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Student ID</th>
                    <th className="p-3">Class & Section</th>
                    <th className="p-3">Admission Date</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {(stats?.recentAdmissions || []).map((st: any) => (
                    <tr key={st.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-purple-400" />
                        {st.firstName} {st.lastName}
                      </td>
                      <td className="p-3 font-mono text-purple-300 font-semibold">{st.studentId}</td>
                      <td className="p-3 text-gray-300">
                        {st.class?.name || 'Grade 8'} - {st.section?.name || 'Section A'}
                      </td>
                      <td className="p-3 font-mono text-gray-400">
                        {new Date(st.admissionDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Badge variant="success" className="text-[10px]">
                          ACTIVE & ENROLLED
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* MULTI-STEP ADMISSION WIZARD MODAL */}
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 print:p-0 print:bg-white print:static print:block">
            <div className="w-full max-w-2xl glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-6 bg-gray-900 print:border-none print:shadow-none print:bg-white print:text-black">
              {/* Wizard Header (Hidden in Print) */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 print:hidden">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Student Admission Wizard</h3>
                </div>
                <button
                  onClick={() => setIsWizardOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Stepper Bar (Hidden in Print) */}
              <div className="grid grid-cols-6 gap-1 print:hidden">
                {[
                  { step: 1, label: 'Student' },
                  { step: 2, label: 'Parent' },
                  { step: 3, label: 'Academic' },
                  { step: 4, label: 'Docs' },
                  { step: 5, label: 'Accounts' },
                  { step: 6, label: 'Done' },
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold text-center transition-all ${
                      currentStep === s.step
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : currentStep > s.step
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-gray-950 text-gray-500'
                    }`}
                  >
                    Step {s.step}: {s.label}
                  </div>
                ))}
              </div>

              {/* STEP 1: Student Information */}
              {currentStep === 1 && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <User className="h-4 w-4" /> Step 1 — Student Personal Information
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 font-medium block">First Name *</label>
                      <input
                        type="text"
                        value={formData.studentInfo.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentInfo: { ...formData.studentInfo, firstName: e.target.value },
                          })
                        }
                        placeholder="Julian"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Last Name *</label>
                      <input
                        type="text"
                        value={formData.studentInfo.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentInfo: { ...formData.studentInfo, lastName: e.target.value },
                          })
                        }
                        placeholder="Vance"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.studentInfo.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentInfo: { ...formData.studentInfo, dateOfBirth: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Gender *</label>
                      <select
                        value={formData.studentInfo.gender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentInfo: { ...formData.studentInfo, gender: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Blood Group</label>
                      <select
                        value={formData.studentInfo.bloodGroup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentInfo: { ...formData.studentInfo, bloodGroup: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Birth Certificate / ID No.</label>
                      <input
                        type="text"
                        value={formData.studentInfo.birthCertificateNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentInfo: { ...formData.studentInfo, birthCertificateNo: e.target.value },
                          })
                        }
                        placeholder="BC-998822"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 font-medium block">Residential Address</label>
                    <input
                      type="text"
                      value={formData.studentInfo.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentInfo: { ...formData.studentInfo, address: e.target.value },
                        })
                      }
                      placeholder="123 Academic Way, Springfield"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Parent Information */}
              {currentStep === 2 && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" /> Step 2 — Parent / Guardian Information
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 font-medium block">Parent First Name *</label>
                      <input
                        type="text"
                        value={formData.parentInfo.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentInfo: { ...formData.parentInfo, firstName: e.target.value },
                          })
                        }
                        placeholder="Robert"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Parent Last Name *</label>
                      <input
                        type="text"
                        value={formData.parentInfo.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentInfo: { ...formData.parentInfo, lastName: e.target.value },
                          })
                        }
                        placeholder="Vance"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Relationship Type *</label>
                      <select
                        value={formData.parentInfo.relationship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentInfo: { ...formData.parentInfo, relationship: e.target.value as any },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      >
                        <option value="FATHER">FATHER</option>
                        <option value="MOTHER">MOTHER</option>
                        <option value="GUARDIAN">GUARDIAN</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Contact Phone *</label>
                      <input
                        type="text"
                        value={formData.parentInfo.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentInfo: { ...formData.parentInfo, phone: e.target.value },
                          })
                        }
                        placeholder="+1 555-9821"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Parent Email</label>
                      <input
                        type="email"
                        value={formData.parentInfo.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentInfo: { ...formData.parentInfo, email: e.target.value },
                          })
                        }
                        placeholder="robert.vance@parent.com"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Occupation</label>
                      <input
                        type="text"
                        value={formData.parentInfo.occupation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentInfo: { ...formData.parentInfo, occupation: e.target.value },
                          })
                        }
                        placeholder="Software Engineer"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Academic Information */}
              {currentStep === 3 && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-400" /> Step 3 — Class Allocation & Roll Number
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 font-medium block">Academic Session *</label>
                      <select
                        value={formData.academicInfo.academicYearId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            academicInfo: { ...formData.academicInfo, academicYearId: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      >
                        <option value="">Select Academic Year</option>
                        {years.map((y) => (
                          <option key={y.id} value={y.id}>
                            {y.name} {y.isCurrent ? '(Active Term)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Assigned Class *</label>
                      <select
                        value={formData.academicInfo.classId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            academicInfo: { ...formData.academicInfo, classId: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} ({cls.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Assigned Section *</label>
                      <select
                        value={formData.academicInfo.sectionId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            academicInfo: { ...formData.academicInfo, sectionId: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                      >
                        <option value="">Select Section</option>
                        {sections.map((sec) => (
                          <option key={sec.id} value={sec.id}>
                            {sec.name} ({sec.capacity} max capacity)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-medium block">Allocated Roll Number *</label>
                      <input
                        type="text"
                        value={formData.academicInfo.rollNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            academicInfo: { ...formData.academicInfo, rollNumber: e.target.value },
                          })
                        }
                        placeholder="05"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Documents Upload Checklist */}
              {currentStep === 4 && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-emerald-400" /> Step 4 — Verification Documents Checklist
                  </h4>

                  <div className="space-y-2">
                    {[
                      { key: 'studentPhoto', label: 'Student Photograph (Verified)' },
                      { key: 'birthCertificate', label: 'Birth Certificate Copy (Verified)' },
                      { key: 'previousSchoolCert', label: 'Previous School Clearance Certificate' },
                      { key: 'parentId', label: 'Parent National ID / Passport Verification' },
                    ].map((doc) => (
                      <label
                        key={doc.key}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-gray-950/60 border border-gray-800 cursor-pointer hover:border-purple-500/30 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={(documentChecklist as any)[doc.key]}
                          onChange={(e) =>
                            setDocumentChecklist({ ...documentChecklist, [doc.key]: e.target.checked })
                          }
                          className="h-4 w-4 accent-purple-600 rounded"
                        />
                        <span className="font-semibold text-white">{doc.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Atomic Account Creation Preview */}
              {currentStep === 5 && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-400" /> Step 5 — Atomic Account Creation & Credentials
                  </h4>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                    <p className="font-bold flex items-center gap-2 text-sm">
                      <ShieldCheck className="h-4 w-4 text-amber-400" /> Transaction Safeguard Active
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Submitting will execute an <strong>atomic database transaction</strong> creating the Student entity, Parent entity, and two authentication accounts with encrypted bcrypt passwords. If any step fails, changes roll back completely.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800 space-y-1">
                      <span className="text-gray-400 text-[10px] block">STUDENT ACCOUNT</span>
                      <p className="text-white font-bold">{formData.studentInfo.firstName} {formData.studentInfo.lastName}</p>
                      <p className="text-purple-300 text-[11px]">Role: STUDENT</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800 space-y-1">
                      <span className="text-gray-400 text-[10px] block">PARENT ACCOUNT</span>
                      <p className="text-white font-bold">{formData.parentInfo.firstName} {formData.parentInfo.lastName}</p>
                      <p className="text-purple-300 text-[11px]">Role: PARENT</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Confirmation & Admission Slip */}
              {currentStep === 6 && admissionResult && (
                <div className="space-y-6 text-xs print:text-black">
                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto print:hidden">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white print:text-black">Admission Successful</h3>
                    <p className="text-xs text-gray-400 print:text-gray-700">Official Institutional Enrollment Slip</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-950 border border-purple-500/30 print:bg-white print:border-gray-400">
                    <div className="space-y-1">
                      <span className="text-gray-400 print:text-gray-600 block">Student ID</span>
                      <p className="text-lg font-mono font-bold text-purple-400 print:text-purple-700">
                        {admissionResult.studentId}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400 print:text-gray-600 block">Parent ID</span>
                      <p className="text-lg font-mono font-bold text-sky-400 print:text-sky-700">
                        {admissionResult.parentId}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400 print:text-gray-600 block">Student Name</span>
                      <p className="text-sm font-bold text-white print:text-black">{admissionResult.studentName}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400 print:text-gray-600 block">Class & Section</span>
                      <p className="text-sm font-bold text-white print:text-black">
                        {admissionResult.className} ({admissionResult.sectionName})
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-2 print:bg-gray-100 print:border-gray-300">
                    <h5 className="font-bold text-purple-300 print:text-black flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Account Credentials Generated
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-gray-400 print:text-gray-600">Student Account:</span>
                        <Badge variant="success" className="ml-1 text-[9px]">Created</Badge>
                        <p className="text-white print:text-black mt-0.5">{admissionResult.studentUsername}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 print:text-gray-600">Parent Account:</span>
                        <Badge variant="success" className="ml-1 text-[9px]">Created</Badge>
                        <p className="text-white print:text-black mt-0.5">{admissionResult.parentUsername}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Footer Controls (Hidden in Print) */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800 print:hidden">
                {currentStep < 6 ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentStep === 1}
                      onClick={handlePrev}
                      className="gap-1 text-xs"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 && (!formData.studentInfo.firstName || !formData.studentInfo.lastName)) ||
                        (currentStep === 2 && (!formData.parentInfo.firstName || !formData.parentInfo.lastName || !formData.parentInfo.phone)) ||
                        (currentStep === 3 && (!formData.academicInfo.classId || !formData.academicInfo.sectionId))
                      }
                      className="gap-1 text-xs"
                    >
                      {currentStep === 5 ? (
                        submitAdmissionMutation.isPending ? 'Processing Transaction...' : 'Complete Admission'
                      ) : (
                        <>Next Step <ChevronRight className="h-4 w-4" /></>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-end gap-2 w-full">
                    <Button variant="outline" size="sm" onClick={handlePrintSlip} className="gap-1.5 text-xs">
                      <Printer className="h-4 w-4 text-sky-400" /> Print Admission Slip
                    </Button>
                    <Button size="sm" onClick={() => setIsWizardOpen(false)} className="text-xs">
                      Done & Close
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
