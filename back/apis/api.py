from ninja import NinjaAPI

api = NinjaAPI()

@api.get("/health")
def get_status(request):
    return {"status": "ok"}