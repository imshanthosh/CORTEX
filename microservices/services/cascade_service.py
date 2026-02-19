"""
AquaCascade — Contamination Propagation Intelligence Service
Simulates contamination spread in water systems.
"""

import numpy as np
import time


# ---------- Water Infrastructure ----------
WATER_INFRASTRUCTURE = [
    {"name": "Bhandup Water Treatment Plant", "lat": 19.1550, "lon": 72.9375, "type": "treatment_plant", "capacity_mld": 2000},
    {"name": "Panjrapur Intake", "lat": 19.1200, "lon": 72.9100, "type": "intake", "capacity_mld": 800},
    {"name": "Vehar Lake Pumping", "lat": 19.1580, "lon": 72.9050, "type": "pumping_station", "capacity_mld": 500},
    {"name": "Tulsi Lake Reserve", "lat": 19.2100, "lon": 72.9130, "type": "reservoir", "capacity_mld": 1200},
    {"name": "Coastal Intake South", "lat": 18.9500, "lon": 72.8200, "type": "intake", "capacity_mld": 600},
]

SOURCE_TYPES = ["Oil Spill", "Sewage Overflow", "Industrial Discharge"]


def simulate_propagation(
    source_lat: float,
    source_lon: float,
    source_type: str,
    flow_direction: float,
    flow_speed: float,
    simulation_hours: int = 12
):
    """
    Simulate contamination spread from a source point.
    Returns time-stepped propagation data with risk zones.
    """
    # Contamination parameters based on source type
    params = _get_contamination_params(source_type)

    time_steps = []
    affected_zones = []
    cumulative_radius = 0

    for hour in range(1, simulation_hours + 1):
        # Calculate spread at this time step
        spread_rate = flow_speed * params["spread_multiplier"]
        cumulative_radius += spread_rate * 0.01  # Convert to degrees approx

        # Direction-biased spread
        dir_rad = np.radians(flow_direction)
        center_lat = source_lat + cumulative_radius * 0.6 * np.cos(dir_rad)
        center_lon = source_lon + cumulative_radius * 0.6 * np.sin(dir_rad)

        # Generate plume polygon
        plume_points = []
        n_points = 24
        for i in range(n_points):
            angle = 2 * np.pi * i / n_points
            # Elongated in flow direction
            r_lat = cumulative_radius * (1 + 0.5 * np.cos(angle - dir_rad))
            r_lon = cumulative_radius * (1 + 0.5 * np.sin(angle - dir_rad))
            # Add noise for realism
            r_lat *= (1 + np.random.uniform(-0.15, 0.15))
            r_lon *= (1 + np.random.uniform(-0.15, 0.15))

            plume_points.append([
                round(center_lat + r_lat * np.cos(angle), 5),
                round(center_lon + r_lon * np.sin(angle), 5)
            ])
        plume_points.append(plume_points[0])  # Close polygon

        # Generate risk intensity grid
        grid_points = _generate_risk_grid(center_lat, center_lon, cumulative_radius, params["intensity_base"])

        # Check infrastructure at risk
        infra_at_risk = _check_infrastructure_risk(center_lat, center_lon, cumulative_radius)

        # Estimate population exposure (rough estimate)
        area_km2 = np.pi * (cumulative_radius * 111) ** 2
        pop_density = 25000  # per km² (Mumbai-like density)
        estimated_population = int(area_km2 * pop_density * 0.3)

        time_steps.append({
            "hour": hour,
            "center": {"lat": round(center_lat, 5), "lon": round(center_lon, 5)},
            "radius_deg": round(cumulative_radius, 5),
            "radius_km": round(cumulative_radius * 111, 2),
            "plume_polygon": plume_points,
            "risk_grid": grid_points,
            "intensity": round(min(params["intensity_base"] * (1 - hour / (simulation_hours * 1.5)), 1.0), 2),
            "area_km2": round(area_km2, 2),
            "estimated_population_exposure": estimated_population,
            "infrastructure_at_risk": infra_at_risk
        })

    # Generate summary alerts
    alerts = _generate_cascade_alerts(time_steps, source_type)

    # Risk intelligence summary
    risk_summary = {
        "treatment_plants_at_risk": len([i for ts in time_steps for i in ts["infrastructure_at_risk"] if i["type"] == "treatment_plant"]),
        "intakes_at_risk": len([i for ts in time_steps for i in ts["infrastructure_at_risk"] if i["type"] == "intake"]),
        "max_population_exposure": max(ts["estimated_population_exposure"] for ts in time_steps),
        "max_area_km2": max(ts["area_km2"] for ts in time_steps),
        "contamination_type": source_type,
    }

    return {
        "time_steps": time_steps,
        "alerts": alerts,
        "risk_summary": risk_summary,
        "source": {
            "lat": source_lat,
            "lon": source_lon,
            "type": source_type,
            "flow_direction": flow_direction,
            "flow_speed": flow_speed,
        }
    }


def _get_contamination_params(source_type: str) -> dict:
    """Get contamination parameters by source type."""
    params = {
        "Oil Spill": {"spread_multiplier": 1.2, "intensity_base": 0.95, "persistence": 0.9},
        "Sewage Overflow": {"spread_multiplier": 0.8, "intensity_base": 0.7, "persistence": 0.6},
        "Industrial Discharge": {"spread_multiplier": 1.0, "intensity_base": 0.85, "persistence": 0.8},
    }
    return params.get(source_type, params["Oil Spill"])


def _generate_risk_grid(center_lat: float, center_lon: float, radius: float, intensity_base: float):
    """Generate a grid of risk intensity points."""
    grid = []
    n = 8
    for i in range(n):
        for j in range(n):
            lat = center_lat + (i - n/2) * radius * 0.3
            lon = center_lon + (j - n/2) * radius * 0.3

            # Distance-based intensity falloff
            dist = np.sqrt((lat - center_lat)**2 + (lon - center_lon)**2)
            intensity = max(0, intensity_base * (1 - dist / (radius * 2)))
            intensity *= (1 + np.random.uniform(-0.1, 0.1))
            intensity = min(max(intensity, 0), 1.0)

            if intensity > 0.05:
                grid.append({
                    "lat": round(lat, 5),
                    "lon": round(lon, 5),
                    "intensity": round(intensity, 3)
                })
    return grid


def _check_infrastructure_risk(center_lat: float, center_lon: float, radius: float):
    """Check which water infrastructure is within contamination radius."""
    at_risk = []
    for infra in WATER_INFRASTRUCTURE:
        dist = np.sqrt((infra["lat"] - center_lat)**2 + (infra["lon"] - center_lon)**2)
        if dist < radius * 2:
            at_risk.append({
                "name": infra["name"],
                "type": infra["type"],
                "distance_km": round(dist * 111, 2),
                "risk_level": "critical" if dist < radius else "warning"
            })
    return at_risk


def _generate_cascade_alerts(time_steps: list, source_type: str):
    """Generate predictive alerts for contamination spread."""
    alerts = []

    for ts in time_steps:
        if ts["infrastructure_at_risk"]:
            for infra in ts["infrastructure_at_risk"]:
                alerts.append({
                    "severity": infra["risk_level"],
                    "message": f"Contamination expected to reach {infra['name']} in {ts['hour']} hours",
                    "hour": ts["hour"],
                    "timestamp": int(time.time())
                })

        if ts["estimated_population_exposure"] > 10000:
            alerts.append({
                "severity": "critical",
                "message": f"High-risk exposure zone: ~{ts['estimated_population_exposure']:,} people at risk at hour {ts['hour']}",
                "hour": ts["hour"],
                "timestamp": int(time.time())
            })

    # Deduplicate alerts
    seen = set()
    unique_alerts = []
    for alert in alerts:
        key = alert["message"]
        if key not in seen:
            seen.add(key)
            unique_alerts.append(alert)

    return unique_alerts[:10]  # Cap at 10 alerts
