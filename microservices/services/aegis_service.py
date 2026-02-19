"""
AEGIS — Urban Water Fragility Intelligence Service
Ported from the original Streamlit AEGIS project.
Provides fragility prediction and network optimization.
"""

import numpy as np
import networkx as nx

# ---------- Zone Configuration ----------
ZONE_LOCATIONS = {
    0: {"lat": 19.07, "lon": 72.87, "name": "Dharavi West"},
    1: {"lat": 19.08, "lon": 72.88, "name": "Dharavi East"},
    2: {"lat": 19.06, "lon": 72.86, "name": "Mahim Creek"},
    3: {"lat": 19.05, "lon": 72.88, "name": "Sion South"},
    4: {"lat": 19.07, "lon": 72.89, "name": "Matunga"},
}

EDGES = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 4), (1, 3)]

RED_THRESHOLD = 70
YELLOW_THRESHOLD = 40


def predict_fragility(scenario: str = "Normal", manual_params: dict = None, time_step: int = 0):
    """
    Predict fragility scores for all zones.
    Uses scenario-based baseline + small neural-net-like perturbation.
    """
    zone_scores = {}

    for zone in ZONE_LOCATIONS:
        # Scenario-based baseline risk
        baseline_risk = _get_baseline_risk(zone, scenario)

        # Manual parameter adjustments (if provided)
        if manual_params:
            baseline_risk += _manual_adjustment(manual_params)

        # Simulated NN contribution (small stochastic component)
        nn_score = np.random.uniform(1, 5) * 0.2

        # Final fragility score
        fragility_score = baseline_risk + nn_score

        # Time-based growth simulation
        if time_step > 0:
            growth = time_step * 2.5
            fragility_score += growth

        # Small variation for realism
        fragility_score += np.random.uniform(-3, 3)

        # Clamp 0-100
        fragility_score = min(max(round(fragility_score, 2), 0), 100)
        zone_scores[zone] = fragility_score

    return zone_scores


def optimize_network(zone_scores: dict):
    """
    Graph-based tanker routing optimization.
    Finds shortest paths from safe zones to critical zones.
    """
    G = nx.Graph()

    for zone, score in zone_scores.items():
        G.add_node(zone, fragility=score)

    G.add_edges_from(EDGES)

    critical_zones = [z for z, s in zone_scores.items() if s > RED_THRESHOLD]
    safe_zones = [z for z, s in zone_scores.items() if s < YELLOW_THRESHOLD]

    dispatch_plan = []

    for critical in critical_zones:
        best_source = None
        best_distance = float("inf")

        for safe in safe_zones:
            try:
                distance = nx.shortest_path_length(G, safe, critical)
                if distance < best_distance:
                    best_distance = distance
                    best_source = safe
            except nx.NetworkXNoPath:
                continue

        if best_source is not None:
            path = nx.shortest_path(G, best_source, critical)
            dispatch_plan.append({
                "from": best_source,
                "to": critical,
                "route": path
            })

    return dispatch_plan


def generate_recommendations(zone_scores: dict):
    """Generate AI recommendations based on fragility analysis."""
    recommendations = []
    critical_count = sum(1 for s in zone_scores.values() if s > RED_THRESHOLD)
    warning_count = sum(1 for s in zone_scores.values() if RED_THRESHOLD >= s > YELLOW_THRESHOLD)
    max_score = max(zone_scores.values())

    if critical_count > 0:
        recommendations.append({
            "priority": "critical",
            "action": "Increase tanker deployment to critical zones immediately",
            "icon": "truck"
        })
        recommendations.append({
            "priority": "critical",
            "action": "Activate backup pumps in affected areas",
            "icon": "settings"
        })

    if max_score > 60:
        recommendations.append({
            "priority": "high",
            "action": "Issue conservation alerts to residents in stressed zones",
            "icon": "alert"
        })

    if warning_count > 0:
        recommendations.append({
            "priority": "medium",
            "action": "Prioritize maintenance on high-risk zone infrastructure",
            "icon": "tool"
        })

    if critical_count == 0 and warning_count == 0:
        recommendations.append({
            "priority": "low",
            "action": "All systems operating within normal parameters",
            "icon": "check"
        })

    return recommendations


def generate_early_warning(zone_scores: dict):
    """Generate early warning messages."""
    max_score = max(zone_scores.values())
    warnings = []

    if max_score > 80:
        warnings.append({
            "severity": "critical",
            "message": "System collapse imminent in next 2-6 hours. Immediate intervention required.",
            "timeframe": "2-6 hours"
        })
    elif max_score > 60:
        warnings.append({
            "severity": "warning",
            "message": "System instability expected in next 6-24 hours. Preventive measures recommended.",
            "timeframe": "6-24 hours"
        })
    elif max_score > 40:
        warnings.append({
            "severity": "caution",
            "message": "Moderate stress detected. Monitor conditions closely.",
            "timeframe": "24-48 hours"
        })

    return warnings


def generate_sample_data():
    """Generate sample CSV data for demo purposes."""
    np.random.seed(42)
    data = []
    for zone in range(5):
        for hour in range(24):
            data.append({
                "zone_id": zone,
                "hour": hour,
                "rainfall": round(np.random.exponential(2), 2),
                "power_availability": round(np.random.uniform(0.5, 1.0), 2),
                "tanker_count": np.random.randint(3, 15),
                "groundwater_level": round(np.random.uniform(2.0, 8.0), 2),
                "demand_surge": round(np.random.normal(1.0, 0.3), 2),
                "price_index": round(np.random.normal(1.0, 0.1), 2),
            })
    return data


# ---------- Internal helpers ----------
def _get_baseline_risk(zone: int, scenario: str) -> float:
    """Scenario-based baseline risk per zone."""
    if scenario == "Flood Event":
        return {0: 30, 1: 25, 2: 85, 3: 65, 4: 20}.get(zone, 10)
    elif scenario == "Power Failure":
        return {0: 20, 1: 80, 2: 55, 3: 30, 4: 25}.get(zone, 10)
    elif scenario == "High Demand Crisis":
        return {0: 25, 1: 30, 2: 35, 3: 75, 4: 50}.get(zone, 10)
    else:  # Normal
        return np.random.uniform(0, 8)


def _manual_adjustment(params: dict) -> float:
    """Calculate risk adjustment from manual parameters."""
    adj = 0
    if params.get("rainfall", 0) > 20:
        adj += 15
    if params.get("power_availability", 1.0) < 0.5:
        adj += 20
    if params.get("tanker_count", 10) < 5:
        adj += 10
    if params.get("groundwater_level", 5) < 3:
        adj += 12
    if params.get("demand_surge", 1.0) > 1.5:
        adj += 15
    if params.get("price_index", 1.0) > 1.5:
        adj += 8
    return adj
