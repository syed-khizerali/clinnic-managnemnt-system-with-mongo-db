import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Brain,
  Calendar,
  FileText,
  Shield,
  BarChart3,
  Check,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Diagnosis',
    desc: 'Smart symptom analysis and treatment suggestions powered by advanced AI.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    desc: 'Digital appointment management with real-time availability.',
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    desc: 'Generate and download prescriptions as PDF in seconds.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Track performance, patient load, and clinic metrics.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    desc: 'Role-based access, encrypted data, and audit logs.',
  },
];

const plans = [
  {
    name: 'Basic',
    price: 0,
    features: ['Up to 100 patients', 'Basic scheduling', 'Email support'],
  },
  {
    name: 'Pro',
    price: 49,
    popular: true,
    features: [
      'Unlimited patients',
      'AI diagnosis support',
      'Prescription PDF',
      'Analytics dashboard',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 149,
    features: [
      'Everything in Pro',
      'Multi-clinic support',
      'Custom integrations',
      'Dedicated support',
    ],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">MediFlow AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Smart Clinic
            <span className="block bg-gradient-to-r from-primary-600 to-medical-emerald bg-clip-text text-transparent">
              Operating System
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Digitize your clinic with AI-powered diagnosis, appointment management,
            and analytics. Built for modern healthcare.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            A complete platform to run your clinic efficiently and serve patients better.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple Pricing
          </h2>
          <p className="text-gray-600 text-center mb-16">
            Start free, upgrade when you need more.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${
                  plan.popular ? 'ring-2 ring-primary-500 shadow-xl' : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-medical-emerald flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`mt-8 block text-center py-3 rounded-lg font-medium transition-all ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to Transform Your Clinic?
          </h2>
          <p className="mt-4 text-primary-100">
            Join hundreds of clinics already using MediFlow AI.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-8 bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-all"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-gray-900">MediFlow AI</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} MediFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
