output "resource_group_name" {
  value = azurerm_resource_group.default.name
}

output "kubernetes_cluster_name" {
  value = azurerm_kubernetes_cluster.default.name
}

output "azuread_application_id" {
  value = azuread_application.directory_role_app.application_id
  
}