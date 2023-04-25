module "vpc" {
  source  = "terraform-google-modules/network/google"
  version = "3.3.0"

  project_id   = "${var.project}"
  network_name = "api_${var.env}"

  subnets = [
    {
      subnet_name   = "api_${var.env}-subnet-01"
      subnet_ip     = "10.${var.env == "dev" ? 10 : 20}.10.0/24"
      subnet_region = "us-central1"
    },
  ]

  secondary_ranges = {
    "api_${var.env}-subnet-01" = []
  }
}