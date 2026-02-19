"""
AquaShield AI — Python Microservices
FastAPI application providing AI computation endpoints for all three products.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import uvicorn

from services.aegis_service import (
    predict_fragility, optimize_network, generate_recommendations,
    generate_early_warning, generate_sample_data, ZONE_LOCATIONS
)
from services.marine_service import (
    generate_vessel_positions, detect_vessel_anomaly, detect_oil_spill,
    generate_marine_alerts
)
from services.cascade_service import simulate_propagation
from services.aquahear_service import generate_audio

# ---------- FastAPI App ----------
app = FastAPI(
    title="AquaShield AI Microservices",
    description="AI computation services for urban water fragility, marine risk, and contamination propagation.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Request/Response Models ====================

class FragilityRequest(BaseModel):
    scenario: str = "Normal"
    time_step: int = 0
    manual_params: Optional[dict] = None

class NetworkOptRequest(BaseModel):
    zone_scores: dict

class VesselAnomalyRequest(BaseModel):
    vessels: Optional[list] = None

class OilSpillRequest(BaseModel):
    vessel: dict

class PropagationRequest(BaseModel):
    source_lat: float
    source_lon: float
    source_type: str = "Oil Spill"
    flow_direction: float = 180.0
    flow_speed: float = 2.0
    simulation_hours: int = 12

class AudioRequest(BaseModel):
    language: str = "English"
    alert_type: str = "Stable"
    custom_text: Optional[str] = None


# ==================== Health Check ====================

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AquaShield AI Microservices"}


# ==================== AEGIS Endpoints ====================

@app.post("/predict_fragility")
def api_predict_fragility(req: FragilityRequest):
    """Predict fragility scores for all zones."""
    try:
        scores = predict_fragility(req.scenario, req.manual_params, req.time_step)
        plan = optimize_network(scores)
        recommendations = generate_recommendations(scores)
        warnings = generate_early_warning(scores)

        # Build zone details
        zones = []
        for zone_id, score in scores.items():
            loc = ZONE_LOCATIONS.get(zone_id, {})
            status = "critical" if score > 70 else "warning" if score > 40 else "stable"
            zones.append({
                "id": zone_id,
                "name": loc.get("name", f"Zone {zone_id}"),
                "lat": loc.get("lat", 0),
                "lon": loc.get("lon", 0),
                "score": score,
                "status": status
            })

        return {
            "zones": zones,
            "scores": {str(k): v for k, v in scores.items()},
            "dispatch_plan": plan,
            "recommendations": recommendations,
            "early_warnings": warnings,
            "summary": {
                "critical_count": sum(1 for s in scores.values() if s > 70),
                "warning_count": sum(1 for s in scores.values() if 40 < s <= 70),
                "stable_count": sum(1 for s in scores.values() if s <= 40),
                "dispatch_required": len(plan) > 0,
                "max_score": max(scores.values()),
                "avg_score": round(sum(scores.values()) / len(scores), 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/optimize_network")
def api_optimize_network(req: NetworkOptRequest):
    """Run graph-based tanker routing optimization."""
    try:
        int_scores = {int(k): v for k, v in req.zone_scores.items()}
        plan = optimize_network(int_scores)
        return {"dispatch_plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sample_data")
def api_sample_data():
    """Generate sample CSV data for AEGIS demo."""
    return {"data": generate_sample_data()}


# ==================== Marine Endpoints ====================

@app.get("/vessel_positions")
def api_vessel_positions():
    """Get current simulated vessel positions."""
    return {"vessels": generate_vessel_positions()}


@app.post("/detect_vessel_anomaly")
def api_detect_vessel_anomaly(req: VesselAnomalyRequest):
    """Detect anomalies in vessel behavior."""
    try:
        vessels = req.vessels if req.vessels else generate_vessel_positions()
        results = []
        for v in vessels:
            result = detect_vessel_anomaly(v)
            result["vessel"] = v
            results.append(result)

        alerts = generate_marine_alerts(results)

        return {
            "vessel_statuses": results,
            "alerts": alerts,
            "summary": {
                "total": len(results),
                "normal": sum(1 for r in results if r["status"] == "normal"),
                "suspicious": sum(1 for r in results if r["status"] == "suspicious"),
                "distress": sum(1 for r in results if r["status"] == "distress"),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect_oil_spill")
def api_detect_oil_spill(req: OilSpillRequest):
    """Detect potential oil spill for a vessel in distress."""
    try:
        result = detect_oil_spill(req.vessel)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Cascade Endpoints ====================

@app.post("/simulate_propagation")
def api_simulate_propagation(req: PropagationRequest):
    """Simulate contamination propagation."""
    try:
        result = simulate_propagation(
            source_lat=req.source_lat,
            source_lon=req.source_lon,
            source_type=req.source_type,
            flow_direction=req.flow_direction,
            flow_speed=req.flow_speed,
            simulation_hours=req.simulation_hours
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== AquaHear Endpoints ====================

@app.post("/generate_audio")
def api_generate_audio(req: AudioRequest):
    """Generate voice alert audio."""
    try:
        result = generate_audio(req.language, req.alert_type, req.custom_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Run ====================

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
