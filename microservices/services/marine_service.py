"""
Marine Oil Spill Early Detection Service
Provides AIS vessel anomaly detection and oil spill probability analysis.
"""

import numpy as np
import time

# ---------- Vessel Fleet Simulation ----------
VESSEL_TYPES = ["Cargo", "Tanker", "Fishing", "Passenger", "Military"]

# Base vessel data (simulated AIS fleet)
BASE_VESSELS = [
    {"imo": "IMO9181786", "name": "MV Sagarmala", "type": "Tanker", "lat": 18.92, "lon": 72.83, "sog": 12.5, "cog": 45, "heading": 47},
    {"imo": "IMO9234567", "name": "MV Prithvi", "type": "Cargo", "lat": 19.05, "lon": 72.75, "sog": 8.2, "cog": 120, "heading": 118},
    {"imo": "IMO9345678", "name": "FV Matsya", "type": "Fishing", "lat": 18.88, "lon": 72.90, "sog": 5.1, "cog": 200, "heading": 195},
    {"imo": "IMO9456789", "name": "MV Samudra", "type": "Tanker", "lat": 19.10, "lon": 72.70, "sog": 14.0, "cog": 90, "heading": 92},
    {"imo": "IMO9567890", "name": "FV Jaldhara", "type": "Fishing", "lat": 18.95, "lon": 72.95, "sog": 3.5, "cog": 310, "heading": 305},
    {"imo": "IMO9678901", "name": "MV Naukri", "type": "Cargo", "lat": 18.80, "lon": 72.80, "sog": 10.8, "cog": 170, "heading": 172},
    {"imo": "IMO9789012", "name": "PS Disha", "type": "Passenger", "lat": 19.00, "lon": 72.85, "sog": 18.0, "cog": 60, "heading": 58},
    {"imo": "IMO9890123", "name": "MV Rakshak", "type": "Military", "lat": 19.15, "lon": 72.65, "sog": 22.0, "cog": 270, "heading": 268},
]


def generate_vessel_positions():
    """
    Generate current vessel positions with realistic movement simulation.
    Some vessels may show anomalous behavior.
    """
    vessels = []
    current_time = time.time()

    for i, base in enumerate(BASE_VESSELS):
        vessel = dict(base)

        # Add realistic movement noise
        vessel["lat"] += np.random.uniform(-0.02, 0.02)
        vessel["lon"] += np.random.uniform(-0.02, 0.02)
        vessel["sog"] += np.random.uniform(-1, 1)
        vessel["cog"] += np.random.uniform(-5, 5)
        vessel["heading"] += np.random.uniform(-3, 3)

        # Randomly inject anomalies (~20% chance)
        if np.random.random() < 0.20:
            anomaly_type = np.random.choice(["speed_drop", "course_deviation", "stop"])
            if anomaly_type == "speed_drop":
                vessel["sog"] = base["sog"] * np.random.uniform(0.1, 0.4)
            elif anomaly_type == "course_deviation":
                vessel["cog"] = base["cog"] + np.random.uniform(50, 120) * np.random.choice([-1, 1])
            elif anomaly_type == "stop":
                vessel["sog"] = np.random.uniform(0, 0.5)

        vessel["sog"] = max(0, round(vessel["sog"], 1))
        vessel["cog"] = round(vessel["cog"] % 360, 1)
        vessel["heading"] = round(vessel["heading"] % 360, 1)
        vessel["lat"] = round(vessel["lat"], 4)
        vessel["lon"] = round(vessel["lon"], 4)
        vessel["timestamp"] = int(current_time)

        vessels.append(vessel)

    return vessels


def detect_vessel_anomaly(vessel: dict, base_vessel: dict = None):
    """
    Detect anomalies in vessel behavior.
    Checks for: speed drops, course deviations, unexpected stops.
    """
    anomalies = []
    status = "normal"
    risk_score = 0

    # Find matching base vessel for comparison
    if base_vessel is None:
        base_vessel = next((v for v in BASE_VESSELS if v["imo"] == vessel.get("imo")), None)

    if base_vessel is None:
        return {"status": "unknown", "anomalies": [], "risk_score": 0}

    # Speed drop detection (>50% reduction)
    if base_vessel["sog"] > 2:
        speed_ratio = vessel["sog"] / base_vessel["sog"]
        if speed_ratio < 0.5:
            anomalies.append({
                "type": "speed_drop",
                "description": f"Speed dropped {round((1-speed_ratio)*100)}% from {base_vessel['sog']} to {vessel['sog']} knots",
                "severity": "high"
            })
            risk_score += 40

    # Course deviation (>40°)
    course_diff = abs(vessel["cog"] - base_vessel["cog"])
    if course_diff > 180:
        course_diff = 360 - course_diff
    if course_diff > 40:
        anomalies.append({
            "type": "course_deviation",
            "description": f"Course deviated {round(course_diff)}° from expected heading",
            "severity": "medium" if course_diff < 80 else "high"
        })
        risk_score += 30 if course_diff < 80 else 50

    # Unexpected stop (speed < 1 knot in open sea)
    if vessel["sog"] < 1.0 and base_vessel["sog"] > 3:
        anomalies.append({
            "type": "unexpected_stop",
            "description": "Vessel stopped unexpectedly in open waters",
            "severity": "critical"
        })
        risk_score += 60

    # Determine status
    if risk_score >= 60:
        status = "distress"
    elif risk_score >= 25:
        status = "suspicious"
    else:
        status = "normal"

    return {
        "imo": vessel["imo"],
        "name": vessel.get("name", "Unknown"),
        "status": status,
        "anomalies": anomalies,
        "risk_score": min(risk_score, 100)
    }


def detect_oil_spill(vessel: dict):
    """
    Estimate oil spill probability for a vessel in distress.
    Returns spill probability and estimated area.
    """
    base_probability = 0.0

    # Tankers have highest spill risk
    if vessel.get("type") == "Tanker":
        base_probability = 0.75
    elif vessel.get("type") == "Cargo":
        base_probability = 0.45
    else:
        base_probability = 0.20

    # Add randomness
    probability = min(base_probability + np.random.uniform(-0.1, 0.15), 0.98)

    # Generate spill area polygon (circular approximation)
    center_lat = vessel["lat"]
    center_lon = vessel["lon"]
    radius = np.random.uniform(0.005, 0.02)  # degrees

    polygon = []
    for angle in np.linspace(0, 2 * np.pi, 12):
        lat = center_lat + radius * np.cos(angle) * (1 + np.random.uniform(-0.2, 0.2))
        lon = center_lon + radius * np.sin(angle) * (1 + np.random.uniform(-0.2, 0.2))
        polygon.append([round(lat, 5), round(lon, 5)])
    polygon.append(polygon[0])  # Close polygon

    # Estimated spill area in km²
    area_km2 = round(np.pi * (radius * 111) ** 2, 2)

    return {
        "probability": round(probability, 2),
        "spill_polygon": polygon,
        "area_km2": area_km2,
        "center": {"lat": center_lat, "lon": center_lon},
        "severity": "critical" if probability > 0.6 else "warning"
    }


def generate_marine_alerts(vessel_statuses: list):
    """Generate authority alert messages."""
    alerts = []

    for vs in vessel_statuses:
        if vs["status"] == "distress":
            alerts.append({
                "severity": "critical",
                "message": f"DISTRESS: {vs['name']} ({vs['imo']}) — Immediate inspection required",
                "vessel": vs["imo"],
                "timestamp": int(time.time()),
                "actions": [
                    "Notify Coast Guard",
                    "Dispatch inspection vessel",
                    "Activate containment protocol"
                ]
            })
        elif vs["status"] == "suspicious":
            alerts.append({
                "severity": "warning",
                "message": f"SUSPICIOUS: {vs['name']} ({vs['imo']}) — Anomalous behavior detected near coast",
                "vessel": vs["imo"],
                "timestamp": int(time.time()),
                "actions": [
                    "Monitor vessel closely",
                    "Request position report",
                    "Alert patrol vessels in area"
                ]
            })

    return alerts
