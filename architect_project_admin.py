"""Private code descriptions for the existing permission-protected admin view."""
import uuid


def private_code_notes(remote, architect_id, codes):
    owner=str(uuid.UUID(str(architect_id)))
    allowed={str(c['id']) for c in codes}
    if not allowed:
        return []
    rows=remote('/rest/v1/architect_code_notes',params={
        'select':'code_id,note,project:architect_projects(name),variant:architect_project_variants(name)',
        'architect_id':'eq.'+owner,'limit':1000},timeout=10) or []
    return [r for r in rows if str(r.get('code_id')) in allowed]
