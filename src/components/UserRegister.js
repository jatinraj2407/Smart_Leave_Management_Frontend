import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { registerUser, getAllCountries } from '../services/api.js';

function UserRegister() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: '',
    userName: '',
    password: '',
    countryName: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let abort = false;

    (async () => {
      try {
        setCountriesLoading(true);
        setCountriesError('');
        const res = await getAllCountries();
        const data = res?.data || [];
        const normalized = Array.isArray(data)
          ? data
              .map((c) => {
                if (typeof c === 'string') return { value: c, label: c };
                const label = c.name || c.countryName || c.label || c.value || '';
                const value = c.name || c.countryName || c.value || label;
                return { value, label };
              })
              .filter((c) => c.value && c.label)
          : [];

        if (!abort) setCountries(normalized);
      } catch (e) {
        if (!abort) setCountriesError(e?.response?.data || e.message || 'Failed to load countries.');
      } finally {
        if (!abort) setCountriesLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, []);

  useEffect(() => {
    if (!form.countryName && countries.length > 0) {
      setForm((prev) => ({ ...prev, countryName: countries[0].value }));
    }
  }, [countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    for (const key in form) {
      if (!form[key]) {
        setErrorMsg(`Please fill out the ${key} field.`);
        return;
      }
    }

    try {
      const res = await registerUser(form);
      alert(res.data);
      navigate('/user-login');
    } catch (error) {
      const msg = error.response?.data;
      setErrorMsg(typeof msg === 'string' ? msg : 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <>
      <div className="position-absolute top-0 end-0 m-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/user-login')}
        >
          &larr; Back to Login
        </button>
      </div>

      <div className="container mt-5">
        <h2 className="mb-4">Welcome User! 👋</h2>
        <p className="text-muted">Please register to manage holidays.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="tel"
              name="phoneNumber"
              className="form-control"
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <select
              name="gender"
              className="form-select"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="userName"
              className="form-control"
              placeholder="Username"
              value={form.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              minLength={6}
              title="Password must be at least 6 characters long"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Country</label>
            <select
              name="countryName"
              className="form-select"
              value={form.countryName}
              onChange={handleChange}
              required
              disabled={countriesLoading || !!countriesError}
            >
              {countriesLoading && <option>Loading countries…</option>}
              {countriesError && <option disabled>Error loading countries</option>}
              {!countriesLoading && !countriesError && (
                <>
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </>
              )}
            </select>
            {countriesError && (
              <small className="text-danger d-block mt-1">
                {countriesError}
              </small>
            )}
          </div>

          {errorMsg && <div className="text-danger mb-3">{errorMsg}</div>}

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default UserRegister;
